# Absen Bimbel 📚

Aplikasi pencatatan absensi mengajar untuk guru bimbel. Data tersimpan di localStorage browser.

## Fitur
- ✅ Input absensi: tanggal, kelas (1-12, private, calistung), mata pelajaran, deskripsi materi
- ✅ Kelas 3-9 dengan subkelas A-F
- ✅ Kelas private dengan nama siswa
- ✅ Riwayat absen dengan tampilan card & tabel (toggle)
- ✅ Filter: bulan, kelas, mata pelajaran, pencarian teks
- ✅ Edit & hapus data
- ✅ Statistik sesi per kelas/bulan & per mata pelajaran
- ✅ Export CSV & PDF
- ✅ Data tersimpan di localStorage (tanpa login)

## Setup

### Prerequisites
- Node.js 18+
- npm atau pnpm

### Instalasi

```bash
# Masuk ke folder project
cd absen-bimbel

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Buka browser di `http://localhost:5173`

### Build untuk Production

```bash
npm run build
npm run preview
```

## Tech Stack
- **React 18** + **Vite 5**
- **Tailwind CSS v3**
- **shadcn/ui** (Radix UI primitives)
- **date-fns** – format tanggal
- **jsPDF** + **jspdf-autotable** – export PDF
- **lucide-react** – ikon

## Struktur Project

```
src/
├── components/
│   ├── ui/           # Shadcn UI components
│   ├── AbsenForm.jsx # Form input absensi
│   ├── AbsenCard.jsx # Tampilan card
│   ├── AbsenTable.jsx # Tampilan tabel
│   └── StatistikPage.jsx # Halaman statistik
├── lib/
│   ├── constants.js  # Data kelas, mapel, warna
│   ├── storage.js    # CRUD localStorage
│   ├── export.js     # Export CSV & PDF
│   └── utils.js      # cn() utility
├── App.jsx           # Main app
├── main.jsx
└── index.css         # Tailwind + CSS variables
```
