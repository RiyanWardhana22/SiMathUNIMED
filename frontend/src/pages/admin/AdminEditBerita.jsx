import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../api";
import "../../styles/Login.css";

function AdminEditBerita() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [judul, setJudul] = useState("");
  const [isiBerita, setIsiBerita] = useState("");
  const [kategori, setKategori] = useState("berita");
  const [slugLama, setSlugLama] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await api.get(`/get_berita_by_id.php?id=${id}`);
        if (response.data.status === "success") {
          const post = response.data.data;
          setJudul(post.judul);
          setIsiBerita(post.isi_berita);
          setKategori(post.kategori);
          setSlugLama(post.slug);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Gagal mengambil data postingan."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.post("/update_berita.php", {
        id: id,
        judul: judul,
        isi_berita: isiBerita,
        kategori: kategori,
      });

      if (response.data.status === "success") {
        setSuccess("Berita berhasil diperbarui!");
        setTimeout(() => {
          navigate("/admin/berita");
        }, 1500);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Terjadi kesalahan pada server.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <p>Loading data untuk diedit...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Edit Postingan: {slugLama}</h2>
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

        {error && <div className="error-message">{error}</div>}
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

        <button type="submit" className="login-button" disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
        <Link
          to="/admin/berita"
          style={{ display: "inline-block", marginTop: "10px", color: "#555" }}
        >
          Batal
        </Link>
      </form>
    </div>
  );
}

export default AdminEditBerita;
