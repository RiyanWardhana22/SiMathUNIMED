import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api";
import "../../styles/Dashboard.css";
import "../../styles/AdminTable.css";

import {
  FaNewspaper,
  FaChalkboardTeacher,
  FaFileAlt,
  FaImages,
  FaCogs,
  FaPlusCircle,
  FaBeer,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { IoFileTrayStackedSharp } from "react-icons/io5";

function Dashboard() {
  const { authUser } = useContext(AuthContext);
  const [stats, setStats] = useState({
    dosen: 0,
    berita: 0,
    dokumen: 0,
    slider: 0,
  });
  const [recentNews, setRecentNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, newsRes] = await Promise.all([
          api.get("/get_stats.php"),
          api.get("/get_berita.php"),
        ]);

        if (statsRes.data.status === "success") {
          setStats(statsRes.data.data);
        }

        if (newsRes.data.status === "success") {
          setRecentNews(newsRes.data.data.slice(0, 5));
        }
      } catch (err) {
        console.error("Gagal memuat dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  if (loading)
    return (
      <div className="container">
        <p>Memuat Dashboard...</p>
      </div>
    );

  return (
    <div className="container">
      {/* HEADER */}
      <div className="dashboard-header">
        <h2>Dashboard Admin</h2>
        <p>
          Selamat Datang <strong>{authUser.nama_lengkap}</strong>! Anda login
          sebagai {authUser.role}.
        </p>
      </div>

      {/* 1. KARTU STATISTIK (STATS CARDS) */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <h3>{stats.berita}</h3>
            <p>Total Berita</p>
          </div>
          <div className="stat-icon">
            <FaNewspaper />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h3>{stats.dosen}</h3>
            <p>Total Dosen</p>
          </div>
          <div className="stat-icon">
            <FaChalkboardTeacher />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h3>{stats.dokumen}</h3>
            <p>Dokumen</p>
          </div>
          <div className="stat-icon">
            <FaFileAlt />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h3>{stats.slider}</h3>
            <p>Slider Aktif</p>
          </div>
          <div className="stat-icon">
            <FaImages />
          </div>
        </div>
      </div>

      {/* 2. MENU AKSES CEPAT (GRID) */}
      <h3 style={{ marginBottom: "15px" }}>Manajemen Website</h3>
      <div className="action-grid">
        <Link to="/admin/berita/tambah" className="action-card">
          <div className="action-icon">
            <FaPlusCircle />
          </div>
          <span className="action-title">Tulis Berita Baru</span>
        </Link>
        <Link to="/admin/berita" className="action-card">
          <div className="action-icon">
            <FaNewspaper />
          </div>
          <span className="action-title">Kelola Berita</span>
        </Link>
        <Link to="/admin/dosen" className="action-card">
          <div className="action-icon">
            <FaChalkboardTeacher />
          </div>
          <span className="action-title">Kelola Dosen</span>
        </Link>
        <Link to="/admin/dokumen" className="action-card">
          <div className="action-icon">
            <FaFileAlt />
          </div>
          <span className="action-title">Kelola Dokumen</span>
        </Link>
        <Link to="/admin/slider" className="action-card">
          <div className="action-icon">
            <FaImages />
          </div>
          <span className="action-title">Kelola Slider</span>
        </Link>
        <Link to="/admin/prodi" className="action-card">
          <div className="action-icon">
            <IoFileTrayStackedSharp />
          </div>
          <span className="action-title">Pengaturan Prodi</span>
        </Link>
        <Link to="/admin/pengaturan" className="action-card">
          <div className="action-icon">
            <FaCogs />
          </div>
          <span className="action-title">Pengaturan Situs</span>
        </Link>
      </div>

      {/* 3. AKTIVITAS TERKINI (BERITA TERBARU) */}
      <div className="recent-section">
        <div className="section-header">
          <h3>Postingan Terakhir</h3>
          <Link
            to="/admin/berita"
            style={{
              color: "#004a8d",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Lihat Semua &rarr;
          </Link>
        </div>

        <table
          className="admin-table"
          style={{ marginTop: 0, boxShadow: "none" }}
        >
          <thead>
            <tr>
              <th>Judul</th>
              <th>Kategori</th>
              <th>Tanggal</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentNews.length > 0 ? (
              recentNews.map((item) => (
                <tr key={item.id_berita}>
                  <td>{item.judul.substring(0, 50)}...</td>
                  <td>
                    <span className={`kategori-badge ${item.kategori}`}>
                      {item.kategori}
                    </span>
                  </td>
                  <td>{formatDate(item.tanggal_publish)}</td>
                  <td>
                    <span
                      style={{
                        color: "green",
                        fontWeight: "bold",
                        fontSize: "0.8rem",
                      }}
                    >
                      Published
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Belum ada postingan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
