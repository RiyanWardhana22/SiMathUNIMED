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
        <h3>Manajemen Konten</h3>
        <ul style={{ listStyle: "none", paddingLeft: "0" }}>
          <li style={{ marginBottom: "10px" }}>
            <Link
              to="/admin/berita/tambah"
              style={{
                display: "inline-block",
                padding: "10px 15px",
                backgroundColor: "#004a8d",
                color: "white",
                textDecoration: "none",
                borderRadius: "5px",
              }}
            >
              + Tambah Berita / Event Baru
            </Link>
          </li>
          {/* Nanti kita tambahkan link "Edit Berita", "Kelola Dosen", dll di sini */}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
