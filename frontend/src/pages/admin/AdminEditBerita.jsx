import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import api from "../../api";
import "../../styles/Login.css";

function AdminEditBerita() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [judul, setJudul] = useState("");
  const [isiBerita, setIsiBerita] = useState("");
  const [kategori, setKategori] = useState("berita");
  const [slugLama, setSlugLama] = useState("");
  const [existingImage, setExistingImage] = useState(null);
  const [gambarFile, setGambarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

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
          setExistingImage(post.gambar_header);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGambarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("id", id);
    formData.append("judul", judul);
    formData.append("isi_berita", isiBerita);
    formData.append("kategori", kategori);

    if (gambarFile) {
      formData.append("gambar_header", gambarFile);
    }

    try {
      const response = await api.post("/update_berita.php", formData, {
        headers: { "Content-Type": "multipart/form-data" },
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

  if (loading)
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="container">
      <h2 style={{ marginBottom: "20px" }}>Edit Postingan</h2>
      <form
        className="login-form"
        onSubmit={handleSubmit}
        style={{ maxWidth: "900px" }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            background: "#f4f4f4",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="New Preview"
              style={{ maxHeight: "200px" }}
            />
          ) : existingImage ? (
            <img
              src={`${
                import.meta.env.VITE_API_URL
              }../uploads/images/${existingImage}`}
              alt="Current"
              style={{ maxHeight: "200px" }}
            />
          ) : (
            <p>Belum ada gambar header</p>
          )}
        </div>

        <div className="form-group">
          <label>Judul Postingan</label>
          <input
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            required
            style={{ fontSize: "1.1rem", padding: "10px" }}
          />
        </div>

        <div
          className="form-row"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div className="form-group">
            <label>Kategori</label>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <option value="berita">Berita</option>
              <option value="event">Event</option>
              <option value="pengumuman">Pengumuman</option>
              <option value="prestasi">Prestasi</option>
            </select>
          </div>
          <div className="form-group">
            <label>Ganti Gambar</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              style={{
                width: "100%",
                padding: "7px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                background: "#fff",
              }}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Isi Berita</label>
          <div style={{ background: "#fff" }}>
            <ReactQuill
              theme="snow"
              value={isiBerita}
              onChange={setIsiBerita}
              modules={modules}
              style={{ height: "300px", marginBottom: "50px" }}
            />
          </div>
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

        <button
          type="submit"
          className="login-button"
          disabled={saving}
          style={{ marginTop: "20px" }}
        >
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
