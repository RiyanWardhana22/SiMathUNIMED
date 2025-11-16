import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "../../styles/Login.css";

function AdminTambahBerita() {
  const [judul, setJudul] = useState("");
  const [isiBerita, setIsiBerita] = useState("");
  const [kategori, setKategori] = useState("berita");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    if (!judul || !isiBerita) {
      setError("Judul dan Isi Berita tidak boleh kosong.");
      setLoading(false);
      return;
    }
    try {
      const response = await api.post("/create_berita.php", {
        judul: judul,
        isi_berita: isiBerita,
        kategori: kategori,
      });
      if (response.data.status === "success") {
        setSuccess("Berita baru berhasil ditambahkan!");
        setJudul("");
        setIsiBerita("");
        setKategori("berita");
        setTimeout(() => {
          navigate("/berita");
        }, 1500);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Terjadi kesalahan pada server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Tambah Berita / Event Baru</h2>
      <form
        className="login-form"
        onSubmit={handleSubmit}
        style={{ maxWidth: "800px" }}
      >
        <div className="form-group">
          <label htmlFor="judul">Judul Postingan</label>
          <input
            type="text"
            id="judul"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="kategori">Kategori</label>
          <select
            id="kategori"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "1rem",
            }}
          >
            <option value="berita">Berita</option>
            <option value="event">Event</option>
            <option value="pengumuman">Pengumuman</option>
            <option value="prestasi">Prestasi</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="isiBerita">Isi Berita</label>
          <textarea
            id="isiBerita"
            value={isiBerita}
            onChange={(e) => setIsiBerita(e.target.value)}
            rows="10"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "1rem",
            }}
          />
        </div>

        {/* Tampilkan pesan Error */}
        {error && <div className="error-message">{error}</div>}

        {/* Tampilkan pesan Sukses */}
        {success && (
          <div
            style={{
              color: "#006400",
              backgroundColor: "#DFF2BF",
              border: "1px solid #006400",
              padding: "10px",
              marginBottom: "20px",
              textAlign: "center",
              borderRadius: "4px",
            }}
          >
            {success}
          </div>
        )}

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Menyimpan..." : "Publish Postingan"}
        </button>
      </form>
    </div>
  );
}

export default AdminTambahBerita;
