import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api";
import "../../styles/Login.css";

function AdminTambahDosen() {
  const navigate = useNavigate();

  // State form
  const [namaDosen, setNamaDosen] = useState("");
  const [nip, setNip] = useState("");
  const [idProdi, setIdProdi] = useState("");
  const [bidangKeahlian, setBidangKeahlian] = useState("");
  const [linkGoogleScholar, setLinkGoogleScholar] = useState("");
  const [fotoFile, setFotoFile] = useState(null);

  // State data pendukung
  const [prodiList, setProdiList] = useState([]);

  // State UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // 1. Ambil daftar Prodi saat load
  useEffect(() => {
    const fetchProdi = async () => {
      try {
        const response = await api.get("/get_prodi.php");
        if (response.data.status === "success") {
          setProdiList(response.data.data);
        }
      } catch (err) {
        console.error("Gagal ambil prodi", err);
      }
    };
    fetchProdi();
  }, []);

  // 2. Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("nama_dosen", namaDosen);
    formData.append("nip", nip);
    formData.append("id_prodi", idProdi);
    formData.append("bidang_keahlian", bidangKeahlian);
    formData.append("link_google_scholar", linkGoogleScholar);
    if (fotoFile) {
      formData.append("foto_profil", fotoFile);
    }

    try {
      const response = await api.post("/create_dosen.php", formData);
      if (response.data.status === "success") {
        setSuccess("Dosen berhasil ditambahkan!");
        // Reset form
        setNamaDosen("");
        setNip("");
        setIdProdi("");
        setBidangKeahlian("");
        setLinkGoogleScholar("");
        setFotoFile(null);
        // Redirect setelah 1.5 detik
        setTimeout(() => navigate("/admin/dosen"), 1500);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Tambah Dosen Baru</h2>
      <form
        className="login-form"
        onSubmit={handleSubmit}
        style={{ maxWidth: "800px" }}
      >
        <div className="form-group">
          <label>Nama Lengkap (dengan gelar)</label>
          <input
            type="text"
            value={namaDosen}
            onChange={(e) => setNamaDosen(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>NIP</label>
          <input
            type="text"
            value={nip}
            onChange={(e) => setNip(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Program Studi</label>
          <select
            value={idProdi}
            onChange={(e) => setIdProdi(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "1rem",
            }}
          >
            <option value="">-- Pilih Prodi --</option>
            {prodiList.map((prodi) => (
              <option key={prodi.id_prodi} value={prodi.id_prodi}>
                {prodi.nama_prodi}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Bidang Keahlian</label>
          <textarea
            value={bidangKeahlian}
            onChange={(e) => setBidangKeahlian(e.target.value)}
            rows="3"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <div className="form-group">
          <label>Foto Profil (Opsional)</label>
          <input
            type="file"
            onChange={(e) => setFotoFile(e.target.files[0])}
            accept="image/*"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <div className="form-group">
          <label>Link Google Scholar (Opsional)</label>
          <input
            type="url"
            value={linkGoogleScholar}
            onChange={(e) => setLinkGoogleScholar(e.target.value)}
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

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Dosen"}
        </button>
        <Link
          to="/admin/dosen"
          style={{ display: "inline-block", marginTop: "10px", color: "#555" }}
        >
          Batal
        </Link>
      </form>
    </div>
  );
}

export default AdminTambahDosen;
