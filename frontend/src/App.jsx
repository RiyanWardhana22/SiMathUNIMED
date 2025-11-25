import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./Layout";
import Home from "./pages/Home";
import Profil from "./pages/Profil";
import ProdiDetail from "./pages/ProdiDetail";
import Dosen from "./pages/Dosen";
import DosenDetail from "./pages/DosenDetail";
import Berita from "./pages/Berita";
import BeritaDetail from "./pages/BeritaDetail";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/admin/Dashboard";
import AdminTambahBerita from "./pages/admin/AdminTambahBerita";
import AdminKelolaBerita from "./pages/admin/AdminKelolaBerita";
import AdminEditBerita from "./pages/admin/AdminEditBerita";
import AdminKelolaDosen from "./pages/admin/AdminKelolaDosen";
import AdminEditDosen from "./pages/admin/AdminEditDosen";
import AdminKelolaDokumen from "./pages/admin/AdminKelolaDokumen";
import AdminPengaturan from "./pages/admin/AdminPengaturan";
import AdminKelolaProdi from "./pages/admin/AdminKelolaProdi";
import AdminEditProdi from "./pages/admin/AdminEditProdi";
import AdminKelolaSlider from "./pages/admin/AdminKelolaSlider";
import Akademik from "./pages/Akademik";
import AdminTambahDosen from "./pages/admin/AdminTambahDosen";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminKelolaUsers from "./pages/admin/AdminKelolaUsers";
import AdminTambahUser from "./pages/admin/AdminTambahUser";
import AdminEditUser from "./pages/admin/AdminEditUser";
import SiAduDu from "./pages/SiAduDu";
import AdminPengaduan from "./pages/admin/AdminPengaduan";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ALL ROLE */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="profil" element={<Profil />} />
          <Route path="prodi/:id" element={<ProdiDetail />} />
          <Route path="dosen" element={<Dosen />} />
          <Route path="dosen/:id" element={<DosenDetail />} />
          <Route path="berita" element={<Berita />} />
          <Route path="berita/:slug" element={<BeritaDetail />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="akademik" element={<Akademik />} />
          <Route path="siadudu" element={<SiAduDu />} />
        </Route>

        {/* ROLE SUPERADMIN */}
        <Route element={<Layout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/berita" element={<AdminKelolaBerita />} />
            <Route
              path="/admin/berita/tambah"
              element={<AdminTambahBerita />}
            />
            <Route
              path="/admin/berita/edit/:id"
              element={<AdminEditBerita />}
            />
            <Route path="/admin/dosen" element={<AdminKelolaDosen />} />
            <Route path="/admin/dosen/tambah" element={<AdminTambahDosen />} />
            <Route path="/admin/dosen/edit/:id" element={<AdminEditDosen />} />
            <Route path="/admin/dokumen" element={<AdminKelolaDokumen />} />
            <Route path="/admin/prodi" element={<AdminKelolaProdi />} />
            <Route path="/admin/prodi/edit/:id" element={<AdminEditProdi />} />
            <Route path="/admin/slider" element={<AdminKelolaSlider />} />
            <Route path="/admin/pengaduan" element={<AdminPengaduan />} />
            <Route path="/admin/pengaturan" element={<AdminPengaturan />} />
            <Route path="/admin/users" element={<AdminKelolaUsers />} />
            <Route path="/admin/users/tambah" element={<AdminTambahUser />} />
            <Route path="/admin/users/edit/:id" element={<AdminEditUser />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
