import { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import "../styles/Profil.css";
import "../styles/Berita.css";
import HomeSlider from "../components/HomeSlider";

function Home() {
  const [prodi, setProdi] = useState([]);
  const [settings, setSettings] = useState(null);
  const [berita, setBerita] = useState([]);
  const [stats, setStats] = useState(null);
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [prodiRes, settingsRes, beritaRes, statsRes, sliderRes] =
          await Promise.all([
            api.get("/get_prodi.php"),
            api.get("/get_settings.php"),
            api.get("/get_berita.php"),
            api.get("/get_stats.php"),
            api.get("/get_sliders.php"),
          ]);

        // Handle Prodi
        if (prodiRes.data.status === "success") {
          setProdi(prodiRes.data.data);
        } else {
          setProdi([]);
        }

        // Handle Settings
        if (settingsRes.data.status === "success") {
          setSettings(settingsRes.data.data);
        } else {
          setSettings(null);
        }

        // Handle Berita
        if (beritaRes.data.status === "success") {
          setBerita(beritaRes.data.data.slice(0, 3));
        } else {
          setBerita([]);
        }

        // 3. HANDLE STATISTIK
        if (statsRes.data.status === "success") {
          setStats(statsRes.data.data);
        } else {
          setStats(null);
        }

        // 4. HANDLE SLIDERS
        if (sliderRes.data.status === "success") {
          setSliders(sliderRes.data.data);
        } else {
          setSliders([]);
        }
      } catch (err) {
        console.error("Gagal mengambil data beranda:", err);
        setError("Gagal memuat data beranda.");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading)
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="container">
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );

  return (
    <>
      {sliders.length > 0 && <HomeSlider slides={sliders} />}

      <div className="container">
        {/* BAGIAN 1: SAMBUTAN & STATISTIK */}
        <div className="home-header-grid">
          {settings && (
            <div className="home-sambutan">
              <h2>Sambutan Ketua Jurusan</h2>
              <pre className="profil-content">
                {settings.sambutan_ketua_jurusan}
              </pre>
            </div>
          )}

          {/* Sisi kanan: Statistik */}
          {stats && settings && (
            <div className="home-statistik">
              <h3>TENTANG JURUSAN MATEMATIKA</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-value">{stats.jumlah_dosen}</span>
                  <span className="stat-label">Dosen</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.jumlah_mahasiswa}</span>
                  <span className="stat-label">Mahasiswa</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.jumlah_prestasi}</span>
                  <span className="stat-label">Prestasi</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">
                    {settings.akreditasi_jurusan}
                  </span>
                  <span className="stat-label">Akreditasi</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BAGIAN 2: HIGHLIGHT PROGRAM STUDI */}
        <div className="home-prodi-highlight">
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Program Studi
          </h2>
          <div className="prodi-card-container">
            {prodi.length > 0 &&
              prodi.map((item) => (
                <div key={item.id_prodi} className="prodi-card">
                  <h3>{item.nama_prodi}</h3>
                  <p>
                    {item.deskripsi
                      ? item.deskripsi.substring(0, 100) + "..."
                      : "Info detail..."}
                  </p>
                  <Link
                    to={`/prodi/${item.id_prodi}`}
                    className="prodi-card-link"
                  >
                    Lihat Detail
                  </Link>
                </div>
              ))}
          </div>
        </div>

        {/* BAGIAN 3: BERITA TERBARU */}
        <div className="home-berita-terbaru">
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Berita & Event Terbaru
          </h2>
          <div className="berita-list">
            {berita.length > 0 ? (
              berita.map((item) => (
                <div key={item.id_berita} className="berita-card">
                  <img
                    src={`${import.meta.env.VITE_API_URL}../uploads/images/${
                      item.gambar_header || "default.jpg"
                    }`}
                    alt={item.judul}
                    className="berita-card-image"
                  />
                  <div className="berita-card-content">
                    <span className={`berita-card-kategori ${item.kategori}`}>
                      {item.kategori}
                    </span>
                    <Link
                      to={`/berita/${item.slug}`}
                      className="berita-card-judul"
                    >
                      {item.judul}
                    </Link>
                    <small className="berita-card-meta">
                      Dipublish pada {formatDate(item.tanggal_publish)}
                    </small>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center" }}>Belum ada berita terbaru.</p>
            )}
          </div>
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <Link to="/berita" className="prodi-card-link">
              Lihat Semua Berita
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
