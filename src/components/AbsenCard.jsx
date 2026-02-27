import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, GraduationCap } from "lucide-react"
import { getKelasLabel, getMapelLabel, MAPEL_COLORS } from "@/lib/constants"

export default function AbsenCard({ entry, onEdit, onDelete }) {
  const mapelColor = MAPEL_COLORS[entry.mapel] || 'bg-gray-50 text-gray-700 border-gray-200'

  function formatTanggal(dateStr) {
    try {
      const [y, m, d] = dateStr.split('-')
      return format(new Date(+y, +m - 1, +d), "EEEE, d MMM yyyy", { locale: id })
    } catch {
      return dateStr
    }
  }

  return (
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-xs text-muted-foreground font-mono">{formatTanggal(entry.tanggal)}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <div className="flex items-center gap-1.5 bg-secondary rounded-md px-2.5 py-1">
                <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm font-semibold">{getKelasLabel(entry)}</span>
              </div>
              <Badge className={`text-xs border ${mapelColor} bg-opacity-80`} variant="outline">
                {getMapelLabel(entry.mapel)}
              </Badge>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">{entry.deskripsi}</p>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEdit(entry)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(entry.id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
