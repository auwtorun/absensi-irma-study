const STORAGE_KEY = 'absen_bimbel_data'

export function getAbsensi() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveAbsensi(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function addAbsensi(entry) {
  const data = getAbsensi()
  const newEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  data.unshift(newEntry)
  saveAbsensi(data)
  return newEntry
}

export function updateAbsensi(id, updatedEntry) {
  const data = getAbsensi()
  const index = data.findIndex(e => e.id === id)
  if (index !== -1) {
    data[index] = { ...data[index], ...updatedEntry }
    saveAbsensi(data)
    return data[index]
  }
  return null
}

export function deleteAbsensi(id) {
  const data = getAbsensi()
  const filtered = data.filter(e => e.id !== id)
  saveAbsensi(filtered)
}
