import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import AbsenForm from "@/components/AbsenForm"
import DashboardPage from "@/components/DashboardPage"
import RiwayatPage from "@/components/RiwayatPage"
import StatistikPage from "@/components/StatistikPage"
import { getAbsensi, deleteAbsensi } from "@/lib/storage"
import { ClipboardList, LayoutDashboard, List, BarChart3, Trash2 } from "lucide-react"

const VIEWS = { dashboard: 'dashboard', riwayat: 'riwayat', statistik: 'statistik' }

export default function App() {
  const [absensi, setAbsensi] = useState([])
  const [view, setView] = useState(VIEWS.dashboard)
  const [editEntry, setEditEntry] = useState(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const loadData = useCallback(() => setAbsensi(getAbsensi()), [])
  useEffect(() => { loadData() }, [loadData])

  function handleDelete(id) {
    deleteAbsensi(id)
    setDeleteConfirm(null)
    loadData()
  }

  function handleEdit(entry) {
    setEditEntry(entry)
    setShowEditDialog(true)
  }

  function handleFormSuccess() {
    loadData()
    if (editEntry) {
      setShowEditDialog(false)
      setEditEntry(null)
    }
  }

  const navItems = [
    { key: VIEWS.dashboard, label: 'Dashboard', icon: LayoutDashboard },
    { key: VIEWS.riwayat, label: 'Riwayat', icon: List },
    { key: VIEWS.statistik, label: 'Statistik', icon: BarChart3 },
  ]

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
          <nav className="flex items-center gap-1">
            {navItems.map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={view === key ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setView(key)}
                className="text-xs gap-1.5"
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </Button>
            ))}
          </nav>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {view === VIEWS.dashboard && (
          <DashboardPage
            absensi={absensi}
            onFormSuccess={handleFormSuccess}
            onEdit={handleEdit}
            onDelete={(id) => setDeleteConfirm(id)}
            onGoRiwayat={() => setView(VIEWS.riwayat)}
          />
        )}
        {view === VIEWS.riwayat && (
          <RiwayatPage
            absensi={absensi}
            onEdit={handleEdit}
            onDelete={(id) => setDeleteConfirm(id)}
          />
        )}
        {view === VIEWS.statistik && (
          <StatistikPage absensi={absensi} />
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog && !!editEntry} onOpenChange={(open) => { if (!open) { setShowEditDialog(false); setEditEntry(null) } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Absensi</DialogTitle>
          </DialogHeader>
          {editEntry && (
            <AbsenForm
              editData={editEntry}
              onSuccess={() => { handleFormSuccess(); setShowEditDialog(false); setEditEntry(null) }}
              onCancel={() => { setShowEditDialog(false); setEditEntry(null) }}
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