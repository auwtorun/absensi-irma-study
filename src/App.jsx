import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import AbsenForm from "@/components/AbsenForm"
import AbsenCard from "@/components/AbsenCard"
import AbsenTable from "@/components/AbsenTable"
import StatistikPage from "@/components/StatistikPage"
import { getAbsensi, deleteAbsensi } from "@/lib/storage"
import { exportCSV, exportPDF } from "@/lib/export"
import { KELAS_LIST, MAPEL_LIST, getKelasLabel } from "@/lib/constants"
import {
  BookOpen, LayoutGrid, List, Search, Filter,
  Download, BarChart3, Plus, Trash2, FileDown, FileText,
  ClipboardList
} from "lucide-react"

const VIEWS = { riwayat: 'riwayat', statistik: 'statistik' }

export default function App() {
  const [absensi, setAbsensi] = useState([])
  const [view, setView] = useState(VIEWS.riwayat)
  const [displayMode, setDisplayMode] = useState('card') // card | table
  const [editEntry, setEditEntry] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [exportMenu, setExportMenu] = useState(false)

  // Filters
  const [search, setSearch] = useState('')
  const [filterKelas, setFilterKelas] = useState('all')
  const [filterMapel, setFilterMapel] = useState('all')
  const [filterBulan, setFilterBulan] = useState('all')

  const loadData = useCallback(() => {
    setAbsensi(getAbsensi())
  }, [])

  useEffect(() => { loadData() }, [loadData])

  // Available months
  const availableMonths = [...new Set(absensi.map(e => e.tanggal.slice(0, 7)))].sort().reverse()

  // Filtered data
  const filtered = absensi.filter(e => {
    if (filterKelas !== 'all' && e.kelas !== filterKelas) return false
    if (filterMapel !== 'all' && e.mapel !== filterMapel) return false
    if (filterBulan !== 'all' && !e.tanggal.startsWith(filterBulan)) return false
    if (search) {
      const q = search.toLowerCase()
      const label = getKelasLabel(e).toLowerCase()
      return label.includes(q) || e.deskripsi.toLowerCase().includes(q) || (e.namaPrivate || '').toLowerCase().includes(q)
    }
    return true
  })

  function handleDelete(id) {
    deleteAbsensi(id)
    setDeleteConfirm(null)
    loadData()
  }

  function handleEdit(entry) {
    setEditEntry(entry)
    setShowForm(true)
  }

  function handleFormSuccess() {
    loadData()
    if (editEntry) {
      setShowForm(false)
      setEditEntry(null)
    }
  }

  function formatMonthLabel(ym) {
    try {
      const [y, m] = ym.split('-')
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']
      return `${months[+m - 1]} ${y}`
    } catch { return ym }
  }

  const hasFilters = filterKelas !== 'all' || filterMapel !== 'all' || filterBulan !== 'all' || search

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-md bg-foreground flex items-center justify-center">
              <ClipboardList className="h-4 w-4 text-background" />
            </div>
            <span className="font-semibold text-sm tracking-tight">Absen Bimbel</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={view === VIEWS.riwayat ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setView(VIEWS.riwayat)}
              className="text-xs gap-1.5"
            >
              <List className="h-3.5 w-3.5" />
              Riwayat
            </Button>
            <Button
              variant={view === VIEWS.statistik ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setView(VIEWS.statistik)}
              className="text-xs gap-1.5"
            >
              <BarChart3 className="h-3.5 w-3.5" />
              Statistik
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {view === VIEWS.statistik ? (
          <StatistikPage absensi={absensi} />
        ) : (
          <div className="grid lg:grid-cols-[340px_1fr] gap-6">
            {/* Sidebar Form */}
            <div className="lg:sticky lg:top-20 lg:self-start">
              <AbsenForm onSuccess={handleFormSuccess} />
            </div>

            {/* Main Content */}
            <div className="space-y-4">
              {/* Toolbar */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Cari kelas, materi..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-8 h-9 text-sm"
                  />
                </div>

                {/* Filters */}
                <Select value={filterBulan} onValueChange={setFilterBulan}>
                  <SelectTrigger className="w-[120px] h-9 text-xs">
                    <SelectValue placeholder="Bulan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Bulan</SelectItem>
                    {availableMonths.map(m => (
                      <SelectItem key={m} value={m}>{formatMonthLabel(m)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterKelas} onValueChange={setFilterKelas}>
                  <SelectTrigger className="w-[120px] h-9 text-xs">
                    <SelectValue placeholder="Kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kelas</SelectItem>
                    {KELAS_LIST.map(k => (
                      <SelectItem key={k.value} value={k.value}>{k.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterMapel} onValueChange={setFilterMapel}>
                  <SelectTrigger className="w-[120px] h-9 text-xs">
                    <SelectValue placeholder="Mapel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Mapel</SelectItem>
                    {MAPEL_LIST.map(m => (
                      <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* View toggle */}
                <div className="flex border rounded-md overflow-hidden">
                  <button
                    onClick={() => setDisplayMode('card')}
                    className={`px-2.5 py-1.5 text-xs transition-colors ${displayMode === 'card' ? 'bg-foreground text-background' : 'hover:bg-muted text-muted-foreground'}`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDisplayMode('table')}
                    className={`px-2.5 py-1.5 text-xs transition-colors ${displayMode === 'table' ? 'bg-foreground text-background' : 'hover:bg-muted text-muted-foreground'}`}
                  >
                    <List className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Export */}
                <div className="relative">
                  <Button size="sm" variant="outline" className="h-9 gap-1.5 text-xs" onClick={() => setExportMenu(v => !v)}>
                    <Download className="h-3.5 w-3.5" />
                    Export
                  </Button>
                  {exportMenu && (
                    <div className="absolute right-0 top-full mt-1 z-50 bg-background border rounded-lg shadow-md min-w-[150px] py-1" onMouseLeave={() => setExportMenu(false)}>
                      <button
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors"
                        onClick={() => { exportCSV(filtered); setExportMenu(false) }}
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Export CSV
                      </button>
                      <button
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors"
                        onClick={() => { exportPDF(filtered); setExportMenu(false) }}
                      >
                        <FileDown className="h-3.5 w-3.5" />
                        Export PDF
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Result count */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {hasFilters ? `${filtered.length} dari ${absensi.length} sesi` : `${absensi.length} sesi`}
                </p>
                {hasFilters && (
                  <button
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => { setSearch(''); setFilterKelas('all'); setFilterMapel('all'); setFilterBulan('all') }}
                  >
                    Reset filter
                  </button>
                )}
              </div>

              {/* Content */}
              {absensi.length === 0 ? (
                <div className="text-center py-20">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className="text-sm text-muted-foreground mb-1">Belum ada data absensi</p>
                  <p className="text-xs text-muted-foreground">Mulai dengan mengisi form di sebelah kiri</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                  <Search className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm text-muted-foreground">Tidak ada data yang cocok</p>
                </div>
              ) : displayMode === 'card' ? (
                <div className="space-y-3">
                  {filtered.map(entry => (
                    <AbsenCard
                      key={entry.id}
                      entry={entry}
                      onEdit={handleEdit}
                      onDelete={(id) => setDeleteConfirm(id)}
                    />
                  ))}
                </div>
              ) : (
                <AbsenTable
                  entries={filtered}
                  onEdit={handleEdit}
                  onDelete={(id) => setDeleteConfirm(id)}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={showForm && !!editEntry} onOpenChange={(open) => { if (!open) { setShowForm(false); setEditEntry(null) } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Absensi</DialogTitle>
          </DialogHeader>
          {editEntry && (
            <AbsenForm
              editData={editEntry}
              onSuccess={() => { handleFormSuccess(); setShowForm(false); setEditEntry(null) }}
              onCancel={() => { setShowForm(false); setEditEntry(null) }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => { if (!open) setDeleteConfirm(null) }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Absensi?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Data ini akan dihapus secara permanen dan tidak bisa dikembalikan.</p>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(null)}>Batal</Button>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(deleteConfirm)}>
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
