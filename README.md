# SiMathUNIMED - Sistem Informasi Matematika UNIMED

**SiMathUNIMED** adalah aplikasi berbasis web yang dirancang untuk Jurusan Matematika Universitas Negeri Medan (UNIMED). Aplikasi ini bertujuan untuk memberikan informasi akademik, profil jurusan, berita terkini, serta menyediakan layanan pengaduan mahasiswa secara online melalui fitur **SiAduDu**.

Proyek ini memisahkan antara **Frontend** (React + Vite) dan **Backend** (PHP Native REST API).

## 🌟 Fitur Utama

### 🌍 Halaman Publik (Mahasiswa/Pengunjung)
* **Beranda:** Menampilkan slider informasi dan pengumuman penting.
* **Profil:** Sejarah, Visi, Misi, dan Struktur Organisasi Jurusan.
* **Prodi:** Informasi detail mengenai program studi yang tersedia.
* **Dosen:** Direktori data dosen beserta profil lengkapnya.
* **Berita:** Portal berita dan artikel terkini seputar jurusan.
* **Akademik:** Unduhan dokumen akademik (Panduan Skripsi, Form, dll).
* **SiAduDu:** Layanan Pengaduan/Aspirasi Mahasiswa dengan fitur pelacakan status (Tracking).

### 🔐 Panel Admin (Administrator)
* **Dashboard:** Statistik ringkas data sistem.
* **Manajemen Berita:** Tambah, edit, dan hapus berita.
* **Manajemen Dosen:** Kelola data dosen (NIP, Nama, Foto, Pendidikan).
* **Manajemen Prodi:** Update informasi program studi.
* **Manajemen Dokumen:** Upload dan kelola file unduhan akademik.
* **Manajemen Slider:** Mengatur gambar banner halaman depan.
* **Manajemen Pengguna:** Mengelola akun admin.
* **Kotak Masuk Pengaduan:** Menindaklanjuti aspirasi yang masuk dari SiAduDu.
* **Pengaturan Website:** Konfigurasi umum aplikasi.

## 🛠️ Teknologi yang Digunakan

### Frontend (Client-Side)
* **React.js** (v18+)
* **Vite** (Build tool)
* **React Router DOM** (Routing)
* **Axios / Fetch API** (Koneksi ke Backend)
* **CSS Modules** (Styling)

### Backend (Server-Side)
* **PHP Native** (v8.0+)
* **MySQL** (Database)
* **JWT (JSON Web Token)** (Autentikasi aman)
* **PHPMailer** (Fitur Lupa Password & Notifikasi)
* **Composer** (Dependency Manager)

## 📂 Struktur Folder

```bash
SiMathUNIMED/
├── backend/         # Kode program API (PHP)
│   ├── uploads/     # Penyimpanan gambar & dokumen
│   ├── vendor/      # Library PHP (Composer)
│   └── ...          # File-file endpoint API
├── frontend/        # Kode program tampilan (React)
│   ├── src/         # Source code komponen & halaman
│   └── public/      # Aset statis
└── README.md        # Dokumentasi ini
