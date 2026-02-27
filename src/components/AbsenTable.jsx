import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { getKelasLabel, getMapelLabel, MAPEL_COLORS } from "@/lib/constants"

export default function AbsenTable({ entries, onEdit, onDelete }) {
  function formatTanggal(dateStr) {
    try {
      const [y, m, d] = dateStr.split('-')
      return format(new Date(+y, +m - 1, +d), "d MMM yyyy", { locale: id })
    } catch {
      return dateStr
    }
  }

  if (entries.length === 0) return null

  return (
    <div className="rounded-xl border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Tanggal</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Kelas</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Mapel</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">Materi</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => {
            const mapelColor = MAPEL_COLORS[entry.mapel] || 'bg-gray-50 text-gray-700 border-gray-200'
            return (
              <tr key={entry.id} className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                  {formatTanggal(entry.tanggal)}
                </td>
                <td className="px-4 py-3">
                  <span className="font-semibold text-sm">{getKelasLabel(entry)}</span>
                </td>
                <td className="px-4 py-3">
                  <Badge className={`text-xs border ${mapelColor}`} variant="outline">
                    {getMapelLabel(entry.mapel)}
                  </Badge>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-muted-foreground line-clamp-1 max-w-[300px]">{entry.deskripsi}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 justify-end">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onEdit(entry)}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(entry.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
