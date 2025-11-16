import { useState, useEffect } from "react";
import api from "../../api";
import "../../styles/Login.css";

function AdminPengaturan() {
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState("");
  const [sejarah, setSejarah] = useState("");
  const [sambutan, setSambutan] = useState("");
  const [fileStruktur, setFileStruktur] = useState(null);
  const [existingGambar, setExistingGambar] = useState("default_struktur.jpg");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/get_settings.php");
        if (response.data.status === "success") {
          const settings = response.data.data;
          setVisi(settings.visi_jurusan || "");
          setMisi(settings.misi_jurusan || "");
          setSejarah(settings.sejarah_jurusan || "");
          setSambutan(settings.sambutan_ketua_jurusan || "");
          setExistingGambar(
            settings.gambar_struktur_organisasi || "default_struktur.jpg"
          );
        } else {
          setError("Gagal mengambil data pengaturan.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Gagal terhubung ke server.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleFileChange = (e) => {
    setFileStruktur(e.target.files[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();

    formData.append("visi_jurusan", visi);
    formData.append("misi_jurusan", misi);
    formData.append("sejarah_jurusan", sejarah);
    formData.append("sambutan_ketua_jurusan", sambutan);

    // Tambahkan file HANYA JIKA user memilih file baru
    if (fileStruktur) {
      formData.append("gambar_struktur", fileStruktur);
    }

    try {
      const response = await api.post("/update_settings.php", formData);

      if (response.data.status === "success") {
        setSuccess("Pengaturan website berhasil diperbarui!");
        setFileStruktur(null); // Reset file input
        // Refresh gambar jika ada yang baru diupload (opsional, perlu handling response)
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Terjadi kesalahan server.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="container">
        <p>Loading pengaturan...</p>
      </div>
    );

  return (
    <div className="container">
      <h2>Pengaturan Website Jurusan</h2>
      <p>Edit konten yang tampil di halaman profil, sambutan, dan lainnya.</p>

      <form
        className="login-form"
        onSubmit={handleSubmit}
        style={{ maxWidth: "800px", marginTop: "20px" }}
      >
        <div className="form-group">
          <label htmlFor="sambutan">Sambutan Ketua Jurusan</label>
          <textarea
            id="sambutan"
            value={sambutan}
            onChange={(e) => setSambutan(e.target.value)}
            rows="5"
            className="textarea-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="sejarah">Sejarah Jurusan</label>
          <textarea
            id="sejarah"
            value={sejarah}
            onChange={(e) => setSejarah(e.target.value)}
            rows="5"
            className="textarea-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="visi">Visi Jurusan</label>
          <textarea
            id="visi"
            value={visi}
            onChange={(e) => setVisi(e.target.value)}
            rows="3"
            className="textarea-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="misi">Misi Jurusan</label>
          <textarea
            id="misi"
            value={misi}
            onChange={(e) => setMisi(e.target.value)}
            rows="5"
            className="textarea-input"
          />
        </div>

        <hr style={{ margin: "20px 0" }} />

        <div className="form-group">
          <label>Gambar Struktur Organisasi Saat Ini</label>
          <img
            src={`${
              import.meta.env.VITE_API_URL
            }../uploads/images/${existingGambar}`}
            alt="Struktur Organisasi"
            style={{
              width: "100%",
              maxWidth: "400px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="gambar_struktur">
            Upload Gambar Struktur Baru (Opsional)
          </label>
          <input
            type="file"
            id="gambar_struktur"
            onChange={handleFileChange}
            accept="image/*"
            className="file-input"
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button type="submit" className="login-button" disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </form>
    </div>
  );
}

export default AdminPengaturan;
