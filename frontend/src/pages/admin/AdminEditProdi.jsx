import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../api";
import "../../styles/Login.css";
import "../../styles/AdminTable.css";

function AdminEditProdi() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [namaProdi, setNamaProdi] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState("");
  const [profilLulusan, setProfilLulusan] = useState("");
  const [akreditasi, setAkreditasi] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchProdiData = async () => {
      try {
        const response = await api.get(`/get_prodi_detail.php?id=${id}`);
        if (response.data.status === "success") {
          const prodi = response.data.data.profil;
          setNamaProdi(prodi.nama_prodi);
          setDeskripsi(prodi.deskripsi || "");
          setVisi(prodi.visi || "");
          setMisi(prodi.misi || "");
          setProfilLulusan(prodi.profil_lulusan || "");
          setAkreditasi(prodi.akreditasi || "");
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Gagal mengambil data prodi.");
      } finally {
        setLoading(false);
      }
    };
    fetchProdiData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.post("/update_prodi.php", {
        id_prodi: id,
        deskripsi: deskripsi,
        visi: visi,
        misi: misi,
        profil_lulusan: profilLulusan,
        akreditasi: akreditasi,
      });

      if (
        response.data.status === "success" ||
        response.data.status === "info"
      ) {
        setSuccess("Data program studi berhasil diperbarui!");
        setTimeout(() => {
          navigate("/admin/prodi");
        }, 1500);
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
        <p>Loading data prodi...</p>
      </div>
    );

  return (
    <div className="container">
      <h2>Edit Program Studi: {namaProdi}</h2>

      <form
        className="login-form"
        onSubmit={handleSubmit}
        style={{ maxWidth: "800px" }}
      >
        <div className="form-group">
          <label htmlFor="akreditasi">
            Akreditasi (misal: "Unggul", "A", "Baik Sekali")
          </label>
          <input
            type="text"
            id="akreditasi"
            value={akreditasi}
            onChange={(e) => setAkreditasi(e.target.value)}
            className="input-input"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "1rem",
            }}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="deskripsi">Deskripsi Program Studi</label>
          <textarea
            id="deskripsi"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            rows="5"
            className="textarea-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="visi">Visi Program Studi</label>
          <textarea
            id="visi"
            value={visi}
            onChange={(e) => setVisi(e.target.value)}
            rows="3"
            className="textarea-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="misi">Misi Program Studi</label>
          <textarea
            id="misi"
            value={misi}
            onChange={(e) => setMisi(e.target.value)}
            rows="5"
            className="textarea-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="profil_lulusan">Profil Lulusan & Prospek Kerja</label>
          <textarea
            id="profil_lulusan"
            value={profilLulusan}
            onChange={(e) => setProfilLulusan(e.target.value)}
            rows="5"
            className="textarea-input"
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="success-message">
            {" "}
            {/* Pastikan class ini ada di CSS Anda */}
            {success}
          </div>
        )}

        <button type="submit" className="login-button" disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
        <Link
          to="/admin/prodi"
          style={{ display: "inline-block", marginTop: "10px", color: "#555" }}
        >
          Batal
        </Link>
      </form>
    </div>
  );
}

export default AdminEditProdi;
