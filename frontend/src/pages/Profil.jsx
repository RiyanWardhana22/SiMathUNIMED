import { useState, useEffect } from "react";
import api from "../api";

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

  if (loading) {
    return (
      <div className="container">
        <p>Loading profil jurusan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="container">
      {settings ? (
        <>
          <h2>Sejarah Jurusan</h2>
          <pre className="profil-content">{settings.sejarah_jurusan}</pre>

          <h2>Visi Jurusan</h2>
          <pre className="profil-content">{settings.visi_jurusan}</pre>

          <h2>Misi Jurusan</h2>
          <pre className="profil-content">{settings.misi_jurusan}</pre>

          <h2>Struktur Organisasi</h2>
          <img
            src={`${import.meta.env.VITE_API_URL}../uploads/images/${
              settings.gambar_struktur_organisasi
            }`}
            alt="Struktur Organisasi Jurusan"
            style={{
              width: "100%",
              maxWidth: "800px",
              border: "1px solid #eee",
              borderRadius: "4px",
              marginTop: "10px",
            }}
          />
        </>
      ) : (
        <p>Data profil tidak ditemukan.</p>
      )}
    </div>
  );
}

export default Profil;
