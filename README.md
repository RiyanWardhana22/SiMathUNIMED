# SiMath UNIMED -- Sistem Informasi Jurusan Matematika Universitas Negeri Medan

SiMath UNIMED adalah sebuah **website Sistem Informasi Jurusan** yang
mencakup empat Program Studi:

-   Pendidikan Matematika\
-   Matematika\
-   Ilmu Komputer\
-   Statistika

Website ini dirancang untuk menyediakan informasi mengenai profil
jurusan, berita, daftar dosen, informasi akademik, layanan pengaduan
(SiAduDu), serta manajemen konten admin.

## ✨ Fitur Utama

### 1. Halaman Utama

-   Slider Berita\
-   Informasi singkat jurusan\
-   Navigasi ke setiap Program Studi

### 2. Berita & Informasi Jurusan

-   Daftar berita\
-   Detail berita\
-   Pengelolaan berita oleh admin

### 3. Profil Jurusan

-   Visi & Misi\
-   Struktur Organisasi\
-   Sejarah jurusan

### 4. Halaman Dosen & Staf

-   Daftar dosen lengkap\
-   Profil singkat setiap dosen

### 5. Informasi Akademik

-   Mata kuliah\
-   Kalender akademik\
-   Informasi praktikum

### 6. SiAduDu -- Sistem Pengaduan Mahasiswa

-   Input pengaduan\
-   Melihat status pengaduan\
-   Pengelolaan pengaduan admin

### 7. Dashboard Admin

-   CRUD Berita\
-   CRUD Dosen\
-   Pengaduan\
-   Manajemen konten lain

------------------------------------------------------------------------

## 🛠 Teknologi yang Digunakan

### Frontend

-   **ReactJS (Vite)**
-   **React Router**
-   CSS Styling\
-   Axios untuk HTTP Request

### Backend

-   **PHP Native**
-   Struktur API JSON

### Database

-   **MySQL**

------------------------------------------------------------------------

## 📁 Struktur Folder Project

    SiMathUNIMED/
    │
    ├── backend/
    ├── frontend/
    ├── uploads/
    └── README.md

------------------------------------------------------------------------

## 🚀 Cara Install & Menjalankan Website

### 1. Instalasi Backend

-   Pindahkan folder `backend` ke server lokal (XAMPP/Laragon).
-   Buat database `simath_unimed`.
-   Sesuaikan `backend/config/database.php`.
-   Jalankan API.

### 2. Instalasi Frontend

    cd frontend
    npm install
    npm run dev

Sesuaikan URL API di `frontend/src/config/api.js`.

------------------------------------------------------------------------

## 🌐 Deploy ke Hosting

### Frontend:

    npm run build

Upload folder **dist/** ke hosting.

### Backend:

Upload folder backend dan sesuaikan konfigurasi database hosting.

------------------------------------------------------------------------

## 🤝 Kontributor

-   **Riyan Wardhana**

------------------------------------------------------------------------

## 📄 License

Bebas digunakan untuk kebutuhan akademik.
