import { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import "../styles/Berita.css";
import HomeSlider from "../components/HomeSlider";
import {
  FaUniversity,
  FaLaptopCode,
  FaChartBar,
  FaCalculator,
} from "react-icons/fa";

function Home() {
  const [prodi, setProdi] = useState([]);
  const [settings, setSettings] = useState(null);
  const [berita, setBerita] = useState([]);
  const [stats, setStats] = useState(null);
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getProdiIcon = (nama) => {
    const n = nama.toLowerCase();
    if (n.includes("komputer") || n.includes("informatika"))
      return <FaLaptopCode />;
    if (n.includes("statistika")) return <FaChartBar />;
    if (n.includes("pendidikan")) return <FaUniversity />;
    return <FaCalculator />;
  };

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

        if (prodiRes.data.status === "success") setProdi(prodiRes.data.data);
        if (settingsRes.data.status === "success")
          setSettings(settingsRes.data.data);
        if (beritaRes.data.status === "success")
          setBerita(beritaRes.data.data.slice(0, 3));
        if (statsRes.data.status === "success") setStats(statsRes.data.data);
        if (sliderRes.data.status === "success")
          setSliders(sliderRes.data.data);
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
      <div
        className="container"
        style={{
          textAlign: "center",
          padding: "100px 20px",
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ fontSize: "1.2rem", color: "#666" }}>Loading...</p>
      </div>
    );

  if (error)
    return (
      <div
        className="container"
        style={{
          textAlign: "center",
          padding: "100px 20px",
          color: "red",
          minHeight: "60vh",
        }}
      >
        <p>{error}</p>
      </div>
    );

  return (
    <div className="home-page">
      {sliders.length > 0 && <HomeSlider slides={sliders} />}

      {/* 2. SAMBUTAN SECTION */}
      {settings && (
        <section className="home-section home-sambutan-section">
          <div className="sambutan-container">
            <div className="section-title">
              <h2>Sambutan Ketua Jurusan</h2>
            </div>
            <div
              className="sambutan-content"
              dangerouslySetInnerHTML={{
                __html:
                  settings.sambutan_ketua_jurusan ||
                  "<p>Selamat Datang di Jurusan Matematika UNIMED.</p>",
              }}
            />
          </div>
        </section>
      )}

      {/* 3. STATISTIK SECTION (Full Width Blue) */}
      {stats && settings && (
        <section className="home-stats-section">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{stats.dosen}</span>
              <span className="stat-label">Dosen & Staff</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">928 +</span>
              <span className="stat-label">Mahasiswa Aktif</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.prestasi}</span>
              <span className="stat-label">Prestasi Diraih</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.program_studi}</span>
              <span className="stat-label">Program Studi</span>
            </div>
          </div>
        </section>
      )}

      {/* 4. PRODI HIGHLIGHT SECTION */}
      <section className="home-section home-prodi-section">
        <div className="container">
          <div className="section-title">
            <h2>Program Studi</h2>
            <p>Pilihan program studi unggulan untuk masa depan Anda.</p>
          </div>

          <div className="prodi-card-container">
            {prodi.length > 0 ? (
              prodi.map((item) => (
                <div key={item.id_prodi} className="prodi-card">
                  <div className="prodi-icon">
                    {getProdiIcon(item.nama_prodi)}
                  </div>
                  <h3>{item.nama_prodi}</h3>
                  <p>
                    {item.deskripsi
                      ? item.deskripsi
                          .replace(/<[^>]+>/g, "")
                          .substring(0, 100) + "..."
                      : "Info detail..."}
                  </p>
                  <Link
                    to={`/prodi/${item.id_prodi}`}
                    className="prodi-card-link"
                  >
                    Selengkapnya
                  </Link>
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center", width: "100%" }}>
                Data program studi tidak tersedia.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 5. BERITA TERBARU SECTION */}
      <section className="home-section home-berita-section">
        <div className="container">
          <div className="section-title">
            <h2>Berita & Agenda Terbaru</h2>
            <p>
              Ikuti perkembangan dan kegiatan terbaru di Jurusan Matematika.
            </p>
          </div>

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
                    onError={(e) => {
                      e.target.src = `${
                        import.meta.env.VITE_API_URL
                      }../uploads/images/default.jpg`;
                    }}
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
              <p style={{ textAlign: "center", width: "100%", color: "#777" }}>
                Belum ada berita terbaru.
              </p>
            )}
          </div>

          <div style={{ textAlign: "center" }}>
            <Link to="/berita" className="btn-view-all">
              Lihat Semua Berita
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
