import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Berita.css";

const API_URL = import.meta.env.VITE_API_URL;

function Berita() {
  const [postingan, setPostingan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBerita = async () => {
      setError(null);
      try {
        const response = await axios.get(API_URL + "get_berita.php");
        setPostingan(response.data);
      } catch (err) {
        console.error("Terjadi kesalahan:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBerita();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <div className="container">
      <h2>Berita & Event</h2>
      <p>Informasi terbaru dari Jurusan Matematika UNIMED.</p>

      {loading && <p>Mengambil berita terbaru...</p>}

      {error && (
        <div style={{ color: "red", border: "1px solid red", padding: "10px" }}>
          <h4>Gagal Mengambil Data:</h4>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && postingan && (
        <>
          {postingan.status === "success" ? (
            <div className="berita-list">
              {postingan.data.map((item) => (
                <div key={item.id_berita} className="berita-card">
                  <img
                    src={API_URL + `../uploads/images/${item.gambar_header}`}
                    alt={item.judul}
                    className="berita-card-image"
                  />
                  <div className="berita-card-content">
                    <span className="berita-card-kategori">
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
                      {item.nama_penulis && ` oleh ${item.nama_penulis}`}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>{postingan.message}</p>
          )}
        </>
      )}
    </div>
  );
}

export default Berita;
