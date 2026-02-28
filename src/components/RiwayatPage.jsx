import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AbsenCard from "@/components/AbsenCard"
import AbsenTable from "@/components/AbsenTable"
import { exportCSV, exportPDF } from "@/lib/export"
import { KELAS_LIST, MAPEL_LIST, getKelasLabel } from "@/lib/constants"
import { Search, LayoutGrid, List, Download, FileText, FileDown, BookOpen } from "lucide-react"

export default function RiwayatPage({ absensi, onEdit, onDelete }) {
  const [displayMode, setDisplayMode] = useState('card')
  const [search, setSearch] = useState('')
  const [filterKelas, setFilterKelas] = useState('all')
  const [filterMapel, setFilterMapel] = useState('all')
  const [filterBulan, setFilterBulan] = useState('all')
  const [exportMenu, setExportMenu] = useState(false)

  const availableMonths = useMemo(() =>
    [...new Set(absensi.map(e => e.tanggal.slice(0, 7)))].sort().reverse()
  , [absensi])

  const filtered = useMemo(() => absensi.filter(e => {
    if (filterKelas !== 'all' && e.kelas !== filterKelas) return false
    if (filterMapel !== 'all' && e.mapel !== filterMapel) return false
    if (filterBulan !== 'all' && !e.tanggal.startsWith(filterBulan)) return false
    if (search) {
      const q = search.toLowerCase()
      return getKelasLabel(e).toLowerCase().includes(q)
        || e.deskripsi.toLowerCase().includes(q)
        || (e.namaPrivate || '').toLowerCase().includes(q)
    }
    return true
  }), [absensi, filterKelas, filterMapel, filterBulan, search])

  function formatMonthLabel(ym) {
    try {
      const [y, m] = ym.split('-')
      const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des']
      return `${months[+m - 1]} ${y}`
    } catch { return ym }
  }

  const hasFilters = filterKelas !== 'all' || filterMapel !== 'all' || filterBulan !== 'all' || search

  function resetFilters() {
    setSearch('')
    setFilterKelas('all')
    setFilterMapel('all')
    setFilterBulan('all')
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold">Riwayat Absensi</h2>
        <p className="text-sm text-muted-foreground">Semua sesi yang pernah dicatat</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Cari kelas, materi..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>

        <Select value={filterBulan} onValueChange={setFilterBulan}>
          <SelectTrigger className="w-[110px] h-9 text-xs">
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
          <SelectTrigger className="w-[110px] h-9 text-xs">
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
          <SelectTrigger className="w-[110px] h-9 text-xs">
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
            className={`px-2.5 py-1.5 transition-colors ${displayMode === 'card' ? 'bg-foreground text-background' : 'hover:bg-muted text-muted-foreground'}`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setDisplayMode('table')}
            className={`px-2.5 py-1.5 transition-colors ${displayMode === 'table' ? 'bg-foreground text-background' : 'hover:bg-muted text-muted-foreground'}`}
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
            <div
              className="absolute right-0 top-full mt-1 z-50 bg-background border rounded-lg shadow-md min-w-[150px] py-1"
              onMouseLeave={() => setExportMenu(false)}
            >
              <button
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors"
                onClick={() => { exportCSV(filtered); setExportMenu(false) }}
              >
                <FileText className="h-3.5 w-3.5" /> Export CSV
              </button>
              <button
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors"
                onClick={() => { exportPDF(filtered); setExportMenu(false) }}
              >
                <FileDown className="h-3.5 w-3.5" /> Export PDF
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Count & reset */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {hasFilters ? `${filtered.length} dari ${absensi.length} sesi` : `${absensi.length} sesi`}
        </p>
        {hasFilters && (
          <button className="text-xs text-muted-foreground hover:text-foreground transition-colors" onClick={resetFilters}>
            Reset filter
          </button>
        )}
      </div>

      {/* Content */}
      {absensi.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p className="text-sm text-muted-foreground">Belum ada data absensi</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Search className="h-10 w-10 mx-auto mb-3 opacity-20" />
          <p className="text-sm text-muted-foreground">Tidak ada data yang cocok</p>
        </div>
      ) : displayMode === 'card' ? (
        <div className="space-y-3">
          {filtered.map(entry => (
            <AbsenCard key={entry.id} entry={entry} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      ) : (
        <AbsenTable entries={filtered} onEdit={onEdit} onDelete={onDelete} />
      )}
    </div>
  )
}