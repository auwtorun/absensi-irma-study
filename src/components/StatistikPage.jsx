import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getKelasLabel, getMapelLabel, KELAS_LIST, MAPEL_LIST } from "@/lib/constants"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { BarChart3, TrendingUp, BookOpen, Users } from "lucide-react"

export default function StatistikPage({ absensi }) {
  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)

  // Build list of available months
  const availableMonths = useMemo(() => {
    const months = new Set()
    absensi.forEach(e => {
      const [y, m] = e.tanggal.split('-')
      months.add(`${y}-${m}`)
    })
    return Array.from(months).sort().reverse()
  }, [absensi])

  // Filter by month
  const filtered = useMemo(() => {
    return absensi.filter(e => e.tanggal.startsWith(selectedMonth))
  }, [absensi, selectedMonth])

  // Stats per kelas
  const perKelas = useMemo(() => {
    const map = {}
    filtered.forEach(e => {
      const key = `${e.kelas}${e.subkelas || ''}${e.namaPrivate ? '_' + e.namaPrivate : ''}`
      if (!map[key]) map[key] = { entry: e, count: 0 }
      map[key].count++
    })
    return Object.values(map).sort((a, b) => b.count - a.count)
  }, [filtered])

  // Stats per mapel
  const perMapel = useMemo(() => {
    const map = {}
    filtered.forEach(e => {
      if (!map[e.mapel]) map[e.mapel] = 0
      map[e.mapel]++
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [filtered])

  const maxKelasCount = perKelas[0]?.count || 1
  const maxMapelCount = perMapel[0]?.[1] || 1

  function formatMonth(ym) {
    try {
      const [y, m] = ym.split('-')
      return format(new Date(+y, +m - 1, 1), "MMMM yyyy", { locale: id })
    } catch { return ym }
  }

  return (
    <div className="space-y-6">
      {/* Header with month selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Rekap Statistik</h2>
          <p className="text-sm text-muted-foreground">Total sesi per kelas & mata pelajaran</p>
        </div>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableMonths.length === 0
              ? <SelectItem value={selectedMonth}>{formatMonth(selectedMonth)}</SelectItem>
              : availableMonths.map(m => (
                <SelectItem key={m} value={m}>{formatMonth(m)}</SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Total Sesi</span>
            </div>
            <p className="text-2xl font-semibold font-mono">{filtered.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Kelas Aktif</span>
            </div>
            <p className="text-2xl font-semibold font-mono">{perKelas.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Mapel</span>
            </div>
            <p className="text-2xl font-semibold font-mono">{perMapel.length}</p>
          </CardContent>
        </Card>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <BarChart3 className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Belum ada data untuk bulan ini</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Per Kelas */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Sesi per Kelas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {perKelas.map(({ entry, count }) => (
                <div key={`${entry.id}-stat`} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{getKelasLabel(entry)}</span>
                    <span className="text-sm font-mono font-semibold">{count}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-foreground rounded-full transition-all duration-500"
                      style={{ width: `${(count / maxKelasCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Per Mapel */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Sesi per Mata Pelajaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {perMapel.map(([mapel, count]) => (
                <div key={mapel} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{getMapelLabel(mapel)}</span>
                    <span className="text-sm font-mono font-semibold">{count}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-foreground rounded-full transition-all duration-500"
                      style={{ width: `${(count / maxMapelCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
