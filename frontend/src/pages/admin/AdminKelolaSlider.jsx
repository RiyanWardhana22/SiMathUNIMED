import { useState, useEffect } from "react";
import api from "../../api"; // Interceptor kita
import "../../styles/Login.css"; // CSS Form
import "../../styles/AdminTable.css"; // CSS Tabel

function AdminKelolaSlider() {
  // State untuk daftar slider di tabel
  const [sliderList, setSliderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk form upload
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [urutan, setUrutan] = useState(10);
  const [file, setFile] = useState(null);

  // State untuk status form
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  // Fungsi untuk mengambil semua data (slider)
  const fetchSliders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/get_sliders.php");
      if (res.data.status === "success") {
        setSliderList(res.data.data);
      } else {
        setSliderList([]);
      }
    } catch (err) {
      setError(err.message || "Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  // Ambil data saat komponen dimuat
  useEffect(() => {
    fetchSliders();
  }, []);

  // Handler untuk form upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !judul) {
      setFormError("Judul dan File Gambar wajib diisi.");
      return;
    }
    setUploading(true);
    setFormError(null);
    setFormSuccess(null);

    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("deskripsi_singkat", deskripsi);
    formData.append("link_url", linkUrl);
    formData.append("urutan", urutan);
    formData.append("gambar_file", file);

    try {
      const response = await api.post("/upload_slider.php", formData);
      if (response.data.status === "success") {
        setFormSuccess("Slider berhasil di-upload!");
        // Reset form
        setJudul("");
        setDeskripsi("");
        setLinkUrl("");
        setUrutan(10);
        setFile(null);
        e.target.reset(); // Reset file input
        // Refresh daftar slider
        fetchSliders();
      } else {
        setFormError(response.data.message);
      }
    } catch (err) {
      setFormError(err.response?.data?.message || "Terjadi kesalahan server.");
    } finally {
      setUploading(false);
    }
  };

  // Handler untuk delete
  const handleDelete = async (id, gambarPath) => {
    if (
      !window.confirm(
        "Yakin ingin menghapus slider ini? File gambar akan dihapus permanen."
      )
    ) {
      return;
    }
    try {
      const response = await api.post("/delete_slider.php", {
        id: id,
        gambar_path: gambarPath,
      });
      if (response.data.status === "success") {
        alert("Slider berhasil dihapus.");
        // Refresh daftar
        fetchSliders();
      } else {
        alert("Gagal menghapus: " + response.data.message);
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container">
      {/* BAGIAN 1: FORM UPLOAD */}
      <h2>Upload Slider Baru</h2>
      <form
        className="login-form"
        onSubmit={handleUpload}
        style={{ maxWidth: "800px", marginBottom: "40px" }}
      >
        <div className="form-group">
          <label htmlFor="judul">Judul Slider</label>
          <input
            type="text"
            id="judul"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="deskripsi">Deskripsi Singkat (Opsional)</label>
          <input
            type="text"
            id="deskripsi"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="link_url">
            Link Tujuan (Opsional, misal: /berita/seminar)
          </label>
          <input
            type="text"
            id="link_url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="urutan">Urutan (Angka kecil tampil dulu)</label>
          <input
            type="number"
            id="urutan"
            value={urutan}
            onChange={(e) => setUrutan(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="gambar_file">Pilih Gambar Banner (Wajib)</label>
          <input
            type="file"
            id="gambar_file"
            onChange={(e) => setFile(e.target.files[0])}
            required
            className="file-input"
            accept="image/*"
          />
        </div>

        {formError && <div className="error-message">{formError}</div>}
        {formSuccess && (
          <div className="success-message">
            {" "}
            {/* Pastikan class ini ada di CSS Anda */}
            {formSuccess}
          </div>
        )}

        <button type="submit" className="login-button" disabled={uploading}>
          {uploading ? "Mengupload..." : "Upload Slider"}
        </button>
      </form>

      {/* BAGIAN 2: TABEL SLIDER */}
      <h2>Daftar Slider Aktif</h2>
      {loading ? (
        <p>Loading daftar slider...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Gambar</th>
              <th>Judul</th>
              <th>Link</th>
              <th>Urutan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sliderList.length > 0 ? (
              sliderList.map((slider) => (
                <tr key={slider.id_slider}>
                  <td>
                    <img
                      src={`${import.meta.env.VITE_API_URL}../uploads/images/${
                        slider.gambar_path
                      }`}
                      alt={slider.judul}
                      style={{
                        width: "100px",
                        height: "auto",
                        borderRadius: "4px",
                      }}
                    />
                  </td>
                  <td>{slider.judul}</td>
                  <td>{slider.link_url}</td>
                  <td>{slider.urutan}</td>
                  <td>
                    <button
                      onClick={() =>
                        handleDelete(slider.id_slider, slider.gambar_path)
                      }
                      className="btn-hapus"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  Belum ada slider yang di-upload.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminKelolaSlider;
