import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Dashboard() {
  const { authUser } = useContext(AuthContext);

  return (
    <div className="container">
      <h2>Selamat Datang di Dashboard Admin</h2>
      <p>Halo, **{authUser.nama_lengkap}**!</p>
      <p>Peran Anda adalah: **{authUser.role}**</p>
      <br />
      <p>Dari sini, Anda nanti akan bisa mengelola:</p>
      <ul>
        <li>Manajemen Berita & Event</li>
        <li>Manajemen Dosen & Staff</li>
        <li>Manajemen Dokumen Akademik</li>
      </ul>
    </div>
  );
}

export default Dashboard;
