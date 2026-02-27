import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectLabel, SelectGroup, SelectSeparator } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { KELAS_LIST, SUBKELAS_LIST, MAPEL_LIST } from "@/lib/constants"
import { addAbsensi, updateAbsensi } from "@/lib/storage"
import { BookOpen, CalendarDays, GraduationCap, FileText, User } from "lucide-react"

const defaultForm = {
  tanggal: new Date().toISOString().split('T')[0],
  kelas: '',
  subkelas: '',
  namaPrivate: '',
  mapel: '',
  deskripsi: '',
}

export default function AbsenForm({ onSuccess, editData, onCancel }) {
  const [form, setForm] = useState(editData ? {
    tanggal: editData.tanggal,
    kelas: editData.kelas,
    subkelas: editData.subkelas || '',
    namaPrivate: editData.namaPrivate || '',
    mapel: editData.mapel,
    deskripsi: editData.deskripsi,
  } : defaultForm)
  const [errors, setErrors] = useState({})

  const selectedKelas = KELAS_LIST.find(k => k.value === form.kelas)
  const hasSubkelas = selectedKelas?.hasSubkelas
  const isPrivate = selectedKelas?.isPrivate

  function validate() {
    const e = {}
    if (!form.tanggal) e.tanggal = 'Tanggal wajib diisi'
    if (!form.kelas) e.kelas = 'Kelas wajib dipilih'
    if (hasSubkelas && !form.subkelas) e.subkelas = 'Subkelas wajib dipilih'
    if (isPrivate && !form.namaPrivate.trim()) e.namaPrivate = 'Nama siswa wajib diisi'
    if (!form.mapel) e.mapel = 'Mata pelajaran wajib dipilih'
    if (!form.deskripsi.trim()) e.deskripsi = 'Deskripsi materi wajib diisi'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    const payload = {
      tanggal: form.tanggal,
      kelas: form.kelas,
      subkelas: hasSubkelas ? form.subkelas : '',
      namaPrivate: isPrivate ? form.namaPrivate.trim() : '',
      mapel: form.mapel,
      deskripsi: form.deskripsi.trim(),
    }
    if (editData) {
      updateAbsensi(editData.id, payload)
    } else {
      addAbsensi(payload)
    }
    setErrors({})
    if (!editData) setForm(defaultForm)
    onSuccess?.()
  }

  function handleKelasChange(val) {
    setForm(f => ({ ...f, kelas: val, subkelas: '', namaPrivate: '' }))
    setErrors(e => ({ ...e, kelas: undefined, subkelas: undefined, namaPrivate: undefined }))
  }

  return (
    <Card className="border-0 shadow-none sm:border sm:shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-base flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          {editData ? 'Edit Absensi' : 'Tambah Absensi'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Tanggal */}
          <div className="space-y-1.5">
            <Label htmlFor="tanggal" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <CalendarDays className="h-3.5 w-3.5" /> Tanggal Sesi
            </Label>
            <Input
              id="tanggal"
              type="date"
              value={form.tanggal}
              onChange={e => { setForm(f => ({ ...f, tanggal: e.target.value })); setErrors(x => ({ ...x, tanggal: undefined })) }}
              className={errors.tanggal ? 'border-destructive' : ''}
            />
            {errors.tanggal && <p className="text-xs text-destructive">{errors.tanggal}</p>}
          </div>

          {/* Kelas */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <GraduationCap className="h-3.5 w-3.5" /> Kelas
              </Label>
              <Select value={form.kelas} onValueChange={handleKelasChange}>
                <SelectTrigger className={errors.kelas ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Pilih kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>SD (1–6)</SelectLabel>
                    {KELAS_LIST.filter(k => ['1','2','3','4','5','6'].includes(k.value)).map(k => (
                      <SelectItem key={k.value} value={k.value}>{k.label}</SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>SMP (7–9)</SelectLabel>
                    {KELAS_LIST.filter(k => ['7','8','9'].includes(k.value)).map(k => (
                      <SelectItem key={k.value} value={k.value}>{k.label}</SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>SMA (10–12)</SelectLabel>
                    {KELAS_LIST.filter(k => ['10','11','12'].includes(k.value)).map(k => (
                      <SelectItem key={k.value} value={k.value}>{k.label}</SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>Lainnya</SelectLabel>
                    {KELAS_LIST.filter(k => ['private','calistung'].includes(k.value)).map(k => (
                      <SelectItem key={k.value} value={k.value}>{k.label}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.kelas && <p className="text-xs text-destructive">{errors.kelas}</p>}
            </div>

            {/* Subkelas */}
            {hasSubkelas && (
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Subkelas</Label>
                <Select value={form.subkelas} onValueChange={val => { setForm(f => ({ ...f, subkelas: val })); setErrors(x => ({ ...x, subkelas: undefined })) }}>
                  <SelectTrigger className={errors.subkelas ? 'border-destructive' : ''}>
                    <SelectValue placeholder="A – F" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBKELAS_LIST.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subkelas && <p className="text-xs text-destructive">{errors.subkelas}</p>}
              </div>
            )}
          </div>

          {/* Nama Private */}
          {isPrivate && (
            <div className="space-y-1.5">
              <Label htmlFor="namaPrivate" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <User className="h-3.5 w-3.5" /> Nama Siswa Private
              </Label>
              <Input
                id="namaPrivate"
                placeholder="Masukkan nama siswa..."
                value={form.namaPrivate}
                onChange={e => { setForm(f => ({ ...f, namaPrivate: e.target.value })); setErrors(x => ({ ...x, namaPrivate: undefined })) }}
                className={errors.namaPrivate ? 'border-destructive' : ''}
              />
              {errors.namaPrivate && <p className="text-xs text-destructive">{errors.namaPrivate}</p>}
            </div>
          )}

          {/* Mapel */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <FileText className="h-3.5 w-3.5" /> Mata Pelajaran
            </Label>
            <Select value={form.mapel} onValueChange={val => { setForm(f => ({ ...f, mapel: val })); setErrors(x => ({ ...x, mapel: undefined })) }}>
              <SelectTrigger className={errors.mapel ? 'border-destructive' : ''}>
                <SelectValue placeholder="Pilih mata pelajaran" />
              </SelectTrigger>
              <SelectContent>
                {MAPEL_LIST.map(m => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.mapel && <p className="text-xs text-destructive">{errors.mapel}</p>}
          </div>

          {/* Deskripsi */}
          <div className="space-y-1.5">
            <Label htmlFor="deskripsi" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Deskripsi Materi
            </Label>
            <Textarea
              id="deskripsi"
              placeholder="Tuliskan materi yang diajarkan hari ini..."
              value={form.deskripsi}
              onChange={e => { setForm(f => ({ ...f, deskripsi: e.target.value })); setErrors(x => ({ ...x, deskripsi: undefined })) }}
              className={`min-h-[100px] resize-none ${errors.deskripsi ? 'border-destructive' : ''}`}
            />
            {errors.deskripsi && <p className="text-xs text-destructive">{errors.deskripsi}</p>}
          </div>

          <div className="flex gap-2 pt-1">
            <Button type="submit" className="flex-1">
              {editData ? 'Simpan Perubahan' : 'Simpan Absensi'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Batal
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
