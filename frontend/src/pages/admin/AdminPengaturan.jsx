import { useState, useEffect } from "react";
import api from "../../api";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "../../styles/Login.css";

const tabStyle = {
  padding: "10px 20px",
  cursor: "pointer",
  borderBottom: "2px solid transparent",
  fontWeight: "bold",
  color: "#666",
};
const activeTabStyle = {
  ...tabStyle,
  borderBottom: "2px solid #004a8d",
  color: "#004a8d",
};

function AdminPengaturan() {
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState("");
  const [sejarah, setSejarah] = useState("");
  const [sambutan, setSambutan] = useState("");

  const [fileStruktur, setFileStruktur] = useState(null);
  const [existingGambar, setExistingGambar] = useState("default_struktur.jpg");
  const [previewUrl, setPreviewUrl] = useState(null);

  const [activeTab, setActiveTab] = useState("umum");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const modules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/get_settings.php");
        if (response.data.status === "success") {
          const s = response.data.data;
          setVisi(s.visi_jurusan || "");
          setMisi(s.misi_jurusan || "");
          setSejarah(s.sejarah_jurusan || "");
          setSambutan(s.sambutan_ketua_jurusan || "");
          setExistingGambar(
            s.gambar_struktur_organisasi || "default_struktur.jpg"
          );
        }
      } catch (err) {
        setError("Gagal koneksi.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileStruktur(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
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

    if (fileStruktur) {
      formData.append("gambar_struktur", fileStruktur);
    }

    try {
      const response = await api.post("/update_settings.php", formData);
      if (response.data.status === "success") {
        setSuccess("Pengaturan berhasil diperbarui!");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Terjadi kesalahan server.");
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
      <h2>Pengaturan Website</h2>

      {/* TAB NAVIGATION */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #ccc",
          marginBottom: "20px",
        }}
      >
        <div
          style={activeTab === "umum" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("umum")}
        >
          Sambutan & Sejarah
        </div>
        <div
          style={activeTab === "visimisi" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("visimisi")}
        >
          Visi & Misi
        </div>
        <div
          style={activeTab === "struktur" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("struktur")}
        >
          Struktur Organisasi
        </div>
      </div>

      <form
        className="login-form"
        onSubmit={handleSubmit}
        style={{ maxWidth: "900px", padding: "30px" }}
      >
        {/* TAB 1: UMUM */}
        {activeTab === "umum" && (
          <>
            <div className="form-group">
              <label>Sambutan Ketua Jurusan</label>
              <div style={{ background: "#fff" }}>
                <ReactQuill
                  theme="snow"
                  value={sambutan}
                  onChange={setSambutan}
                  modules={modules}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Sejarah Jurusan</label>
              <div style={{ background: "#fff" }}>
                <ReactQuill
                  theme="snow"
                  value={sejarah}
                  onChange={setSejarah}
                  modules={modules}
                />
              </div>
            </div>
          </>
        )}

        {/* TAB 2: VISI MISI */}
        {activeTab === "visimisi" && (
          <>
            <div className="form-group">
              <label>Visi Jurusan</label>
              <div style={{ background: "#fff" }}>
                <ReactQuill
                  theme="snow"
                  value={visi}
                  onChange={setVisi}
                  modules={modules}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Misi Jurusan</label>
              <div style={{ background: "#fff" }}>
                <ReactQuill
                  theme="snow"
                  value={misi}
                  onChange={setMisi}
                  modules={modules}
                  style={{ height: "200px", marginBottom: "50px" }}
                />
              </div>
            </div>
          </>
        )}

        {/* TAB 3: STRUKTUR */}
        {activeTab === "struktur" && (
          <div style={{ textAlign: "center" }}>
            <label
              style={{
                display: "block",
                marginBottom: "10px",
                fontWeight: "bold",
              }}
            >
              Gambar Struktur Saat Ini
            </label>
            <div
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "20px",
                background: "#f9f9f9",
              }}
            >
              <img
                src={
                  previewUrl ||
                  `${
                    import.meta.env.VITE_API_URL
                  }../uploads/images/${existingGambar}`
                }
                alt="Struktur"
                style={{ maxWidth: "100%", maxHeight: "400px" }}
              />
            </div>

            <div className="form-group">
              <label>Upload Gambar Baru</label>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="file-input"
                style={{ width: "100%" }}
              />
            </div>
          </div>
        )}

        {/* TOMBOL SAVE (SELALU MUNCUL) */}
        <div
          style={{
            marginTop: "30px",
            borderTop: "1px solid #eee",
            paddingTop: "20px",
          }}
        >
          {error && <div className="error-message">{error}</div>}
          {success && (
            <div
              style={{
                color: "green",
                background: "#e6fffa",
                padding: "10px",
                borderRadius: "4px",
                marginBottom: "10px",
                textAlign: "center",
              }}
            >
              {success}
            </div>
          )}

          <button type="submit" className="login-button" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Semua Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminPengaturan;
