import { getKelasLabel, getMapelLabel } from "@/lib/constants"
import { format } from "date-fns"
import { id } from "date-fns/locale"

function formatTanggal(dateStr) {
  try {
    const [y, m, d] = dateStr.split('-')
    return format(new Date(+y, +m - 1, +d), "d MMM yyyy", { locale: id })
  } catch {
    return dateStr
  }
}

export function exportCSV(absensi) {
  const headers = ['Tanggal', 'Kelas', 'Mata Pelajaran', 'Deskripsi Materi']
  const rows = absensi.map(e => [
    formatTanggal(e.tanggal),
    getKelasLabel(e),
    getMapelLabel(e.mapel),
    `"${e.deskripsi.replace(/"/g, '""')}"`
  ])

  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `absensi-bimbel-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export async function exportPDF(absensi) {
  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF()

  // Header
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Rekap Absensi Bimbel', 14, 18)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(120)
  doc.text(`Dicetak: ${format(new Date(), "d MMMM yyyy", { locale: id })}  ·  Total: ${absensi.length} sesi`, 14, 26)
  doc.setTextColor(0)

  autoTable(doc, {
    startY: 32,
    head: [['Tanggal', 'Kelas', 'Mata Pelajaran', 'Deskripsi Materi']],
    body: absensi.map(e => [
      formatTanggal(e.tanggal),
      getKelasLabel(e),
      getMapelLabel(e.mapel),
      e.deskripsi,
    ]),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [30, 30, 30], textColor: 255, fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 28 },
      2: { cellWidth: 36 },
      3: { cellWidth: 'auto' },
    },
    alternateRowStyles: { fillColor: [248, 248, 248] },
  })

  doc.save(`absensi-bimbel-${new Date().toISOString().split('T')[0]}.pdf`)
}
