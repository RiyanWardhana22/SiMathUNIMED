import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../api";
import "../../styles/Login.css";

function AdminEditDosen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [namaDosen, setNamaDosen] = useState("");
  const [nip, setNip] = useState("");
  const [bidangKeahlian, setBidangKeahlian] = useState("");
  const [linkGoogleScholar, setLinkGoogleScholar] = useState("");
  const [idProdi, setIdProdi] = useState("");
  const [fotoProfilFile, setFotoProfilFile] = useState(null);
  const [existingFoto, setExistingFoto] = useState("default.jpg");
  const [prodiList, setProdiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dosenRes = await api.get(`/get_dosen_detail.php?id=${id}`);
        if (dosenRes.data.status === "success") {
          const dosen = dosenRes.data.data;
          setNamaDosen(dosen.nama_dosen);
          setNip(dosen.nip);
          setBidangKeahlian(dosen.bidang_keahlian || "");
          setLinkGoogleScholar(dosen.link_google_scholar || "");
          setIdProdi(dosen.id_prodi || "");
          setExistingFoto(dosen.foto_profil || "default.jpg");
        } else {
          setError(dosenRes.data.message);
        }
        const prodiRes = await api.get("/get_prodi.php");
        if (prodiRes.data.status === "success") {
          setProdiList(prodiRes.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Gagal mengambil data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleFileChange = (e) => {
    setFotoProfilFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("id_dosen", id);
    formData.append("nama_dosen", namaDosen);
    formData.append("nip", nip);
    formData.append("bidang_keahlian", bidangKeahlian);
    formData.append("link_google_scholar", linkGoogleScholar);
    formData.append("id_prodi", idProdi);
    if (fotoProfilFile) {
      formData.append("foto_profil", fotoProfilFile);
    }
    try {
      const response = await api.post("/update_dosen_detail.php", formData, {});

      if (response.data.status === "success") {
        setSuccess("Data dosen berhasil diperbarui!");
        if (response.data.new_image_path) {
          setExistingFoto(response.data.new_image_path);
        }
        setFotoProfilFile(null); // Hapus file dari state
        setTimeout(() => navigate("/admin/dosen"), 1500);
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
        <p>Loading data dosen...</p>
      </div>
    );

  return (
    <div className="container">
      <h2>Edit Dosen: {namaDosen}</h2>

      <form
        className="login-form"
        onSubmit={handleSubmit}
        style={{ maxWidth: "800px" }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src={`${
              import.meta.env.VITE_API_URL
            }../uploads/images/${existingFoto}`}
            alt="Foto Profil"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="foto_profil">Ganti Foto Profil (Opsional)</label>
          <input
            type="file"
            id="foto_profil"
            onChange={handleFileChange}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="nama_dosen">Nama Dosen (dengan gelar)</label>
          <input
            type="text"
            id="nama_dosen"
            value={namaDosen}
            onChange={(e) => setNamaDosen(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="nip">NIP</label>
          <input
            type="text"
            id="nip"
            value={nip}
            onChange={(e) => setNip(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="id_prodi">Program Studi</label>
          <select
            id="id_prodi"
            value={idProdi}
            onChange={(e) => setIdProdi(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "1rem",
            }}
            required
          >
            <option value="">-- Pilih Program Studi --</option>
            {prodiList.map((prodi) => (
              <option key={prodi.id_prodi} value={prodi.id_prodi}>
                {prodi.nama_prodi}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="bidang_keahlian">Bidang Keahlian</label>
          <textarea
            id="bidang_keahlian"
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
          <label htmlFor="link_google_scholar">Link Google Scholar</label>
          <input
            type="url"
            id="link_google_scholar"
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

        <button type="submit" className="login-button" disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
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

export default AdminEditDosen;
