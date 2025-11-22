import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import api from "../../api";
import "../../styles/Login.css";

function AdminTambahBerita() {
  const [judul, setJudul] = useState("");
  const [isiBerita, setIsiBerita] = useState("");
  const [kategori, setKategori] = useState("berita");
  const [gambarFile, setGambarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGambarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const strippedContent = isiBerita.replace(/<[^>]+>/g, "");
    if (!judul || !strippedContent.trim()) {
      setError("Judul dan Isi Berita tidak boleh kosong.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("isi_berita", isiBerita);
    formData.append("kategori", kategori);
    if (gambarFile) {
      formData.append("gambar_header", gambarFile);
    }

    try {
      const response = await api.post("/create_berita.php", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status === "success") {
        setSuccess("Berita baru berhasil ditambahkan!");
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
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2
        style={{
          marginBottom: "20px",
          borderBottom: "2px solid #004a8d",
          display: "inline-block",
          paddingBottom: "5px",
        }}
      >
        Tulis Berita Baru
      </h2>

      <form
        className="login-form"
        onSubmit={handleSubmit}
        style={{ maxWidth: "900px" }}
      >
        <div className="form-group">
          <label htmlFor="judul">Judul Postingan</label>
          <input
            type="text"
            id="judul"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            required
            placeholder="Masukkan judul berita yang menarik..."
            style={{ fontSize: "1.1rem", padding: "12px" }}
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
              }}
            >
              <option value="berita">Berita Umum</option>
              <option value="event">Agenda / Event</option>
              <option value="pengumuman">Pengumuman Akademik</option>
              <option value="prestasi">Prestasi Mahasiswa/Dosen</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="gambar">Gambar Header (Opsional)</label>
            <input
              type="file"
              id="gambar"
              onChange={handleFileChange}
              style={{
                width: "100%",
                padding: "9px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                background: "#f9f9f9",
              }}
              accept="image/*"
            />
          </div>
        </div>

        {/* Preview Gambar */}
        {previewUrl && (
          <div
            style={{
              marginBottom: "20px",
              textAlign: "center",
              background: "#eee",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                maxHeight: "200px",
                maxWidth: "100%",
                borderRadius: "4px",
              }}
            />
          </div>
        )}

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
          disabled={loading}
          style={{ marginTop: "20px" }}
        >
          {loading ? "Menyimpan..." : "Publish Postingan"}
        </button>
      </form>
    </div>
  );
}

export default AdminTambahBerita;
