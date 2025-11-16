import { useState, useEffect } from "react";
import api from "../../api"; // Interceptor kita
import "../../styles/Login.css"; // CSS Form
import "../../styles/AdminTable.css"; // CSS Tabel

function AdminKelolaDokumen() {
  // State untuk daftar dokumen di tabel
  const [dokumenList, setDokumenList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk daftar prodi (di form upload)
  const [prodiList, setProdiList] = useState([]);

  // State untuk form upload
  const [namaDokumen, setNamaDokumen] = useState("");
  const [kategori, setKategori] = useState("kurikulum");
  const [idProdi, setIdProdi] = useState(""); // '0' atau '' untuk Jurusan
  const [file, setFile] = useState(null);

  // State untuk status form
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  // Fungsi untuk mengambil semua data (dokumen & prodi)
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Ambil daftar dokumen
      const docRes = await api.get("/get_dokumen.php");
      if (docRes.data.status === "success") {
        setDokumenList(docRes.data.data);
      } else {
        setDokumenList([]);
      }

      // 2. Ambil daftar prodi
      const prodiRes = await api.get("/get_prodi.php");
      if (prodiRes.data.status === "success") {
        setProdiList(prodiRes.data.data);
      }
    } catch (err) {
      setError(err.message || "Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  // Ambil data saat komponen dimuat
  useEffect(() => {
    fetchData();
  }, []);

  // Handler untuk form upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setFormError("Silakan pilih file untuk di-upload.");
      return;
    }
    setUploading(true);
    setFormError(null);
    setFormSuccess(null);

    const formData = new FormData();
    formData.append("nama_dokumen", namaDokumen);
    formData.append("kategori", kategori);
    formData.append("id_prodi", idProdi); // Kirim '' jika tidak dipilih
    formData.append("dokumen_file", file);

    try {
      const response = await api.post("/upload_dokumen.php", formData);
      if (response.data.status === "success") {
        setFormSuccess("Dokumen berhasil di-upload!");
        // Reset form
        setNamaDokumen("");
        setFile(null);
        e.target.reset(); // Reset file input
        // Refresh daftar dokumen
        fetchData();
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
  const handleDelete = async (id, filePath) => {
    if (
      !window.confirm(
        "Yakin ingin menghapus dokumen ini? File fisik akan dihapus permanen."
      )
    ) {
      return;
    }
    try {
      const response = await api.post("/delete_dokumen.php", {
        id,
        file_path: filePath,
      });
      if (response.data.status === "success") {
        alert("Dokumen berhasil dihapus.");
        // Refresh daftar
        fetchData();
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
      <h2>Upload Dokumen Baru</h2>
      <form
        className="login-form"
        onSubmit={handleUpload}
        style={{ maxWidth: "800px", marginBottom: "40px" }}
      >
        <div className="form-group">
          <label htmlFor="nama_dokumen">
            Nama Dokumen (misal: "Kurikulum S1 Ilkom 2025")
          </label>
          <input
            type="text"
            id="nama_dokumen"
            value={namaDokumen}
            onChange={(e) => setNamaDokumen(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="kategori">Kategori</label>
          <select
            id="kategori"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            required
            className="select-input"
          >
            <option value="kurikulum">Kurikulum</option>
            <option value="silabus">Silabus</option>
            <option value="formulir_akademik">Formulir Akademik</option>
            <option value="panduan_akademik">Panduan Akademik</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="id_prodi">Terkait Program Studi (Opsional)</label>
          <select
            id="id_prodi"
            value={idProdi}
            onChange={(e) => setIdProdi(e.target.value)}
            className="select-input"
          >
            <option value="">-- Dokumen Jurusan (Umum) --</option>
            {prodiList.map((prodi) => (
              <option key={prodi.id_prodi} value={prodi.id_prodi}>
                {prodi.nama_prodi}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="dokumen_file">Pilih File (PDF, DOCX, XLSX)</label>
          <input
            type="file"
            id="dokumen_file"
            onChange={(e) => setFile(e.target.files[0])}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>
        {formError && <div className="error-message">{formError}</div>}

        {/* Tampilkan pesan Sukses */}
        {formSuccess && (
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
            {formSuccess}
          </div>
        )}
        <button type="submit" className="login-button" disabled={uploading}>
          {uploading ? "Mengupload..." : "Upload Dokumen"}
        </button>
      </form>

      {/* BAGIAN 2: TABEL DOKUMEN */}
      <h2>Daftar Dokumen Terupload</h2>
      {loading ? (
        <p>Loading daftar dokumen...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nama Dokumen</th>
              <th>Kategori</th>
              <th>Prodi</th>
              <th>File Path (Link)</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dokumenList.length > 0 ? (
              dokumenList.map((doc) => (
                <tr key={doc.id_dokumen}>
                  <td>{doc.nama_dokumen}</td>
                  <td>{doc.kategori}</td>
                  <td>{doc.nama_prodi || "Jurusan"}</td>
                  <td>
                    <a
                      href={`${
                        import.meta.env.VITE_API_URL
                      }../uploads/documents/${doc.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {doc.file_path}
                    </a>
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        handleDelete(doc.id_dokumen, doc.file_path)
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
                  Belum ada dokumen yang di-upload.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminKelolaDokumen;
