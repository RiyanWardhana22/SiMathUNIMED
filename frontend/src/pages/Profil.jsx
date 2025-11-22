import { useState, useEffect } from "react";
import api from "../api";
import "../styles/Profil.css";
import { FaUniversity } from "react-icons/fa";

function Profil() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/get_settings.php");
        if (response.data.status === "success") {
          setSettings(response.data.data);
        } else {
          setError("Gagal mengambil data profil.");
        }
      } catch (err) {
        setError(err.message || "Gagal terhubung ke server.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading)
    return (
      <div
        className="container"
        style={{ padding: "80px", textAlign: "center" }}
      >
        <p style={{ fontSize: "1.2rem", color: "#666" }}>
          Loading profil jurusan...
        </p>
      </div>
    );

  if (error)
    return (
      <div
        className="container"
        style={{ color: "red", padding: "80px", textAlign: "center" }}
      >
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    );

  return (
    <div className="profil-page">
      {/* 1. HERO SECTION (MODERN) */}
      <div className="profil-hero">
        {/* Dekorasi Latar Belakang */}
        <div className="hero-circle"></div>
        <FaUniversity className="hero-decoration-icon" />

        {/* Konten Teks */}
        <div className="hero-content">
          <h1>Profil Jurusan</h1>
          <p>
            Membangun Generasi Unggul, Cerdas, dan Berkarakter melalui
            Pendidikan Matematika Berkualitas.
          </p>
        </div>
      </div>

      <div className="container">
        {settings && (
          <>
            {/* 2. SEJARAH JURUSAN */}
            <section className="profil-section">
              <div className="section-header">
                <h2>Sejarah Singkat</h2>
              </div>
              <div
                className="content-block"
                dangerouslySetInnerHTML={{
                  __html:
                    settings.sejarah_jurusan ||
                    "<p>Belum ada data sejarah.</p>",
                }}
              />
            </section>

            {/* 3. VISI & MISI (GRID CARD) */}
            <section className="profil-section">
              <div className="visi-misi-grid">
                {/* Kartu Visi */}
                <div className="vm-card visi">
                  <h3>Visi</h3>
                  <div
                    className="content-block"
                    style={{
                      textAlign: "center",
                      fontStyle: "italic",
                      fontSize: "1.2rem",
                    }}
                    dangerouslySetInnerHTML={{
                      __html:
                        settings.visi_jurusan ||
                        "<p>Data visi belum diisi.</p>",
                    }}
                  />
                </div>

                {/* Kartu Misi */}
                <div className="vm-card misi">
                  <h3>Misi</h3>
                  <div
                    className="content-block"
                    dangerouslySetInnerHTML={{
                      __html:
                        settings.misi_jurusan ||
                        "<p>Data misi belum diisi.</p>",
                    }}
                  />
                </div>
              </div>
            </section>

            {/* 4. STRUKTUR ORGANISASI */}
            <section className="profil-section">
              <div className="section-header">
                <h2>Struktur Organisasi</h2>
              </div>
              <div className="struktur-container">
                <img
                  src={`${import.meta.env.VITE_API_URL}../uploads/images/${
                    settings.gambar_struktur_organisasi
                  }`}
                  alt="Struktur Organisasi Jurusan Matematika"
                  className="struktur-img"
                  onError={(e) => {
                    e.target.src = `${
                      import.meta.env.VITE_API_URL
                    }../uploads/images/default_struktur.jpg`;
                  }}
                />
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default Profil;
