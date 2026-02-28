import { format } from "date-fns"
import { id } from "date-fns/locale"
import AbsenForm from "@/components/AbsenForm"
import AbsenCard from "@/components/AbsenCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getKelasLabel, getMapelLabel, MAPEL_COLORS } from "@/lib/constants"
import { BookOpen, ArrowRight, CalendarDays, GraduationCap } from "lucide-react"

export default function DashboardPage({ absensi, onFormSuccess, onEdit, onDelete, onGoRiwayat }) {
  const recent = absensi.slice(0, 5)

  const today = format(new Date(), "EEEE, d MMMM yyyy", { locale: id })

  // Hitung total sesi bulan ini
  const thisMonth = new Date().toISOString().slice(0, 7)
  const thisMonthCount = absensi.filter(e => e.tanggal.startsWith(thisMonth)).length

  return (
    <div className="grid lg:grid-cols-[340px_1fr] gap-6">
      {/* Sidebar Form */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <AbsenForm onSuccess={onFormSuccess} />
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Summary */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">{today}</p>
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Total Sesi</span>
                </div>
                <p className="text-2xl font-semibold font-mono">{absensi.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Bulan Ini</span>
                </div>
                <p className="text-2xl font-semibold font-mono">{thisMonthCount}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        {/* Recent 5 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Sesi Terakhir</h2>
            {absensi.length > 5 && (
              <Button variant="ghost" size="sm" className="text-xs gap-1 h-7" onClick={onGoRiwayat}>
                Lihat semua
                <ArrowRight className="h-3 w-3" />
              </Button>
            )}
          </div>

          {absensi.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm text-muted-foreground">Belum ada sesi tercatat</p>
              <p className="text-xs text-muted-foreground">Isi form di sebelah kiri untuk mulai</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map(entry => (
                <AbsenCard
                  key={entry.id}
                  entry={entry}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
              {absensi.length > 5 && (
                <button
                  onClick={onGoRiwayat}
                  className="w-full py-2.5 text-xs text-muted-foreground hover:text-foreground border border-dashed rounded-xl transition-colors hover:border-foreground/30"
                >
                  +{absensi.length - 5} sesi lainnya — Lihat semua riwayat
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}