import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table"
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
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="text-xs uppercase tracking-wide font-medium w-[100px]">Tanggal</TableHead>
            <TableHead className="text-xs uppercase tracking-wide font-medium w-[90px]">Kelas</TableHead>
            <TableHead className="text-xs uppercase tracking-wide font-medium w-[110px]">Mapel</TableHead>
            <TableHead className="text-xs uppercase tracking-wide font-medium hidden md:table-cell">Materi</TableHead>
            <TableHead className="w-[70px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry, i) => {
            const mapelColor = MAPEL_COLORS[entry.mapel] || 'bg-gray-50 text-gray-700 border-gray-200'
            return (
              <TableRow key={entry.id} className={i % 2 !== 0 ? 'bg-muted/10' : ''}>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  <span className="block truncate">{formatTanggal(entry.tanggal)}</span>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-xs sm:text-sm block truncate">{getKelasLabel(entry)}</span>
                </TableCell>
                <TableCell>
                  <Badge className={`text-xs border ${mapelColor}`} variant="outline">
                    {getMapelLabel(entry.mapel)}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="text-muted-foreground line-clamp-1 max-w-[300px] text-sm">{entry.deskripsi}</span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 justify-end">
                    <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={() => onEdit(entry)}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(entry.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}