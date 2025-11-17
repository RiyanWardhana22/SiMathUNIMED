import { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import "../styles/Profil.css";

function Home() {
  const [prodi, setProdi] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [prodiRes, settingsRes] = await Promise.all([
          api.get("/get_prodi.php"),
          api.get("/get_settings.php"),
        ]);

        if (prodiRes.data.status === "success") {
          setProdi(prodiRes.data.data);
        } else {
          setProdi([]);
        }

        if (settingsRes.data.status === "success") {
          setSettings(settingsRes.data.data);
        } else {
          setSettings(null);
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
      {/* Nanti kita tambahkan Slider Banner di sini */}
      {/* <div className="hero-slider">[Slider Banner]</div> */}

      <div className="container">
        {/* BAGIAN 1: SAMBUTAN KETUA JURUSAN */}
        {settings && (
          <div className="home-sambutan">
            <h2>Sambutan Ketua Jurusan</h2>
            {/* Kita pinjam style dari 'Profil.css' */}
            <pre className="profil-content">
              {settings.sambutan_ketua_jurusan}
            </pre>
          </div>
        )}

        {/* BAGIAN 2: HIGHLIGHT PROGRAM STUDI */}
        <div className="home-prodi-highlight">
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Program Studi
          </h2>
          <div className="prodi-card-container">
            {prodi.length > 0 ? (
              prodi.map((item) => (
                <div key={item.id_prodi} className="prodi-card">
                  {/* (Nanti kita bisa tambahkan gambar ikon untuk tiap prodi) */}
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
              ))
            ) : (
              <p>Data program studi tidak tersedia.</p>
            )}
          </div>
        </div>

        {/* (Nanti kita tambahkan Quick Links & Statistik di sini) */}
      </div>
    </>
  );
}

export default Home;
