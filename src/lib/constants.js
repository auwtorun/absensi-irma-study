export const KELAS_LIST = [
  { value: '1', label: 'Kelas 1', hasSubkelas: false },
  { value: '2', label: 'Kelas 2', hasSubkelas: false },
  { value: '3', label: 'Kelas 3', hasSubkelas: true },
  { value: '4', label: 'Kelas 4', hasSubkelas: true },
  { value: '5', label: 'Kelas 5', hasSubkelas: true },
  { value: '6', label: 'Kelas 6', hasSubkelas: true },
  { value: '7', label: 'Kelas 7', hasSubkelas: true },
  { value: '8', label: 'Kelas 8', hasSubkelas: true },
  { value: '9', label: 'Kelas 9', hasSubkelas: true },
  { value: '10', label: 'Kelas 10', hasSubkelas: false },
  { value: '11', label: 'Kelas 11', hasSubkelas: false },
  { value: '12', label: 'Kelas 12', hasSubkelas: false },
  { value: 'private', label: 'Private', hasSubkelas: false, isPrivate: true },
  { value: 'calistung', label: 'Calistung', hasSubkelas: false },
]

export const SUBKELAS_LIST = ['A', 'B', 'C', 'D', 'E', 'F']

export const MAPEL_LIST = [
  { value: 'bahasa_indonesia', label: 'Bahasa Indonesia' },
  { value: 'bahasa_inggris', label: 'Bahasa Inggris' },
  { value: 'matematika', label: 'Matematika' },
  { value: 'ipa', label: 'IPA' },
]

export const MAPEL_COLORS = {
  bahasa_indonesia: 'bg-blue-50 text-blue-700 border-blue-200',
  bahasa_inggris: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  matematika: 'bg-orange-50 text-orange-700 border-orange-200',
  ipa: 'bg-purple-50 text-purple-700 border-purple-200',
}

export function getKelasLabel(entry) {
  const kelas = KELAS_LIST.find(k => k.value === entry.kelas)
  if (!kelas) return entry.kelas
  if (kelas.hasSubkelas && entry.subkelas) return `${kelas.label}${entry.subkelas}`
  if (kelas.isPrivate && entry.namaPrivate) return `Private – ${entry.namaPrivate}`
  return kelas.label
}

export function getMapelLabel(value) {
  return MAPEL_LIST.find(m => m.value === value)?.label || value
}
