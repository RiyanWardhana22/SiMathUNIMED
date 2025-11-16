import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Dashboard() {
  const { authUser } = useContext(AuthContext);

  return (
    <div className="container">
      <h2>Selamat Datang di Dashboard Admin</h2>
      <p>Halo, **{authUser.nama_lengkap}**!</p>

      {/* 2. BUAT AREA UNTUK LINK AKSI */}
      <div
        style={{
          margin: "20px 0",
          borderTop: "1px solid #eee",
          paddingTop: "20px",
        }}
      >
        <h3
          style={{
            margin: "20px 0",
          }}
        >
          Manajemen Konten
        </h3>
        <ul style={{ listStyle: "none", paddingLeft: "0" }}>
          <li style={{ marginBottom: "10px" }}>
            <Link
              to="/admin/berita/tambah"
              className="btn-primary"
              style={{ textDecoration: "none" }}
            >
              + Tambah Berita / Event Baru
            </Link>
          </li>

          {/* 1. TAMBAHKAN LINK "KELOLA" BARU */}
          <li style={{ marginBottom: "10px", marginTop: "10px" }}>
            <Link
              to="/admin/berita"
              style={{
                display: "inline-block",
                padding: "8px 12px",
                backgroundColor: "#5bc0de",
                color: "white",
                textDecoration: "none",
                borderRadius: "5px",
              }}
            >
              Kelola Semua Postingan
            </Link>
          </li>

          <li style={{ marginBottom: "10px", marginTop: "10px" }}>
            <Link
              to="/admin/dosen"
              style={{
                display: "inline-block",
                padding: "8px 12px",
                backgroundColor: "#f0ad4e",
                color: "white",
                textDecoration: "none",
                borderRadius: "5px",
              }}
            >
              Kelola Dosen & Staff
            </Link>
          </li>

          <li style={{ marginBottom: "10px", marginTop: "10px" }}>
            <Link
              to="/admin/dokumen"
              style={{
                display: "inline-block",
                padding: "8px 12px",
                backgroundColor: "#337ab7",
                color: "white",
                textDecoration: "none",
                borderRadius: "5px",
              }}
            >
              Kelola Dokumen & File
            </Link>
          </li>
        </ul>

        <div
          style={{
            margin: "20px 0",
            borderTop: "1px solid #eee",
            paddingTop: "20px",
          }}
        >
          <h3>Manajemen Situs</h3>
          <ul style={{ listStyle: "none", paddingLeft: "0" }}>
            <li style={{ marginBottom: "10px" }}>
              <Link
                to="/admin/pengaturan"
                style={{
                  display: "inline-block",
                  padding: "8px 12px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "5px",
                }}
              >
                Pengaturan Website (Visi, Misi, dll)
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
