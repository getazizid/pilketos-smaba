# 🗳️ PILKETOS SMABA 2026
### Sistem E-Voting Pemilihan Ketua & Wakil Ketua OSIS SMA Negeri 1 Batu
*Periode 2026/2027 • Asas LUBER JURDIL • Siap Vercel & Firebase Spark Plan (Gratis)*

---

## 🌟 Fitur Utama

1. **Bilik Suara Digital Siswa (Voter Booth)**:
   - Login menggunakan kombinasi **NISN & Token Unik 6 Karakter**.
   - Tampilan surat suara elektronik interaktif dengan foto paslon, nomor urut, serta modal popup Visi & Misi.
   - Konfirmasi pilihan 2-langkah anti-keliru.
   - Tanda terima digital (Struk Sah Pemilih) dengan Nomor Referensi Kriptografis Unik dan Timestamp.

2. **Keamanan Bilik Suara & Anti-Kecurangan (Kiosk Authorization & Restriksi Mobile)**:
   - **Blokir Akses Smartphone**: Mencegah siswa memilih secara mandiri dari luar area TPS menggunakan ponsel pintar / layar sentuh seluler.
   - **Otorisasi Bilik TPS (Kiosk Mode)**: Workstation komputer di bilik suara TPS harus diaktivasi terlebih dahulu oleh Petugas TPS menggunakan **Kode Keamanan TPS** (`SMABA-TPS-2026`).
   - Token sekali pakai (*one-time use*) yang langsung hangus setelah suara tercatat.

3. **Layar Aula Proyektor (Live Quick Count Mode Terang)**:
   - Tampilan visual spektakuler resolusi tinggi untuk layar proyektor aula utama.
   - Diagram batang perolehan suara real-time, persentase akurat, dan indikator paslon unggul (*leading candidate*).
   - Indikator partisipasi pemilih, total DPT, dan status TPS (Buka, Istirahat, Tutup).
   - Tombol Fullscreen interaktif untuk pengalaman panggung terbaik.

4. **Panel Manajemen Admin & Panitia Terpadu (RBAC)**:
   - **Super Admin**: Akses kontrol penuh, manajemen calon, DPT siswa, generator token, pengaturan keamanan, konfigurasi Firebase, dan berita acara.
   - **Operator TPS**: Pendaftaran pemilih, verifikasi kehadiran, pencetakan kartu pemilih fisik.
   - **Saksi Paslon**: Pemantauan real-time audit log suara masuk dan perolehan suara tanpa hak mengubah data.

5. **Manajemen DPT Siswa & Generator Token**:
   - Format kelas modern tanpa jurusan (`X-1` s/d `X-12`, `XI-1` s/d `XI-12`, `XII-1` s/d `XII-12`).
   - Impor / Ekspor data pemilih via CSV / Excel.
   - Cetak Kartu Pemilih Fisik ukuran standar A4 (6 kartu per lembar) siap potong, lengkap dengan NISN, Token, dan QR code visual.

6. **Format Berita Acara Resmi Format Dinas**:
   - Sesuai tata naskah dinas resmi SMAN 1 Batu.
   - Dilengkapi kop surat resmi, tabel perolehan suara terperinci, persentase, dan kolom tanda tangan resmi:
     - Kepala SMA Negeri 1 Batu: **Anto Dwi Cahyono., S.Pd., M.M**
     - Pembina OSIS: **Distri Adi Setiawan ., S.Pd., SS**
     - Ketua Panitia Pemilihan / MPK.
   - Siap cetak langsung (Print to PDF / Kertas A4).

---

## 🛠️ Arsitektur Teknologi

- **Frontend**: React 19 + Vite 8
- **Styling**: Pure Modern CSS (Light Theme, Glassmorphism, Responsive Grid)
- **Database / Backend**:
  - Cloud: Firebase Cloud Firestore (**Spark Plan - 100% Gratis Tanpa Kartu Kredit**)
  - Local Fallback: LocalStorage Engine otomatis jika belum menyambungkan Firebase
- **Deployment**: Zero-config Vercel deployment (`vercel.json` included)

---

## 🚀 Menjalankan Aplikasi Secara Lokal

### Prasyarat
- Node.js versi 18+ atau yang lebih baru
- NPM atau PNPM / Yarn

### Langkah Instalasi
```bash
# Clone repositori
git clone https://github.com/getazizid/pilketos-smaba.git
cd pilketos-smaba

# Install dependensi
npm install

# Jalankan server pengembangan
npm run dev
```
Buka browser di `http://localhost:5173`.

### Build untuk Produksi
```bash
npm run build
```

---

## 🔐 Akun & Kredensial Bawaan (Default)

| Peran (Role) | Username | Password | Keterangan |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin` | `osis2026` | Akses penuh seluruh sistem & pengaturan |
| **Operator TPS** | `operator1` | `tps1batu` | Pendaftaran & aktivasi pemilih |
| **Saksi Paslon** | `saksi` | `saksi2026` | Monitoring & audit independen |
| **Kode Keamanan TPS** | — | `SMABA-TPS-2026` | PIN aktivasi workstation bilik suara TPS |

*Catatan: Password dan kode keamanan dapat diganti melalui Panel Admin > Pengaturan.*

---

## 🌐 Panduan Deployment ke Vercel

1. Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
2. Klik **Add New Project** > Import repository **`pilketos-smaba`**.
3. Framework Preset akan otomatis terdeteksi sebagai **Vite**.
4. Klik **Deploy**.
5. Aplikasi langsung aktif dengan domain HTTPS gratis (contoh: `pilketos-smaba.vercel.app`).

---

## 📄 Lisensi & Hak Cipta
Dikembangkan untuk SMA Negeri 1 Batu, Jawa Timur &bull; Pemilihan Ketua & Wakil Ketua OSIS Periode 2026/2027.
*Studium Et Virtus.*
