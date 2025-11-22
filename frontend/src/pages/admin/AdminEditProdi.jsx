import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../api";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "../../styles/Login.css";

function AdminEditProdi() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [namaProdi, setNamaProdi] = useState("");
  const [akreditasi, setAkreditasi] = useState("");

  const [deskripsi, setDeskripsi] = useState("");
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState("");
  const [profilLulusan, setProfilLulusan] = useState("");

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
    const fetchProdiData = async () => {
      try {
        const response = await api.get(`/get_prodi_detail.php?id=${id}`);
        if (response.data.status === "success") {
          const prodi = response.data.data.profil;
          setNamaProdi(prodi.nama_prodi);
          setAkreditasi(prodi.akreditasi || "");
          setDeskripsi(prodi.deskripsi || "");
          setVisi(prodi.visi || "");
          setMisi(prodi.misi || "");
          setProfilLulusan(prodi.profil_lulusan || "");
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
        akreditasi: akreditasi,
        deskripsi: deskripsi,
        visi: visi,
        misi: misi,
        profil_lulusan: profilLulusan,
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
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="container">
      <h2
        style={{
          marginBottom: "20px",
          borderBottom: "2px solid #004a8d",
          paddingBottom: "10px",
          display: "inline-block",
        }}
      >
        Edit Program Studi: {namaProdi}
      </h2>

      <form
        className="login-form"
        onSubmit={handleSubmit}
        style={{ maxWidth: "900px" }}
      >
        <div className="form-group">
          <label htmlFor="akreditasi">Akreditasi</label>
          <input
            type="text"
            id="akreditasi"
            value={akreditasi}
            onChange={(e) => setAkreditasi(e.target.value)}
            placeholder="Contoh: Unggul, A, Baik Sekali"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            required
          />
        </div>

        {/* DESKRIPSI */}
        <div className="form-group">
          <label>Deskripsi Program Studi</label>
          <div style={{ background: "#fff" }}>
            <ReactQuill
              theme="snow"
              value={deskripsi}
              onChange={setDeskripsi}
              modules={modules}
            />
          </div>
        </div>

        {/* VISI */}
        <div className="form-group">
          <label>Visi</label>
          <div style={{ background: "#fff" }}>
            <ReactQuill
              theme="snow"
              value={visi}
              onChange={setVisi}
              modules={modules}
            />
          </div>
        </div>

        {/* MISI */}
        <div className="form-group">
          <label>Misi</label>
          <div style={{ background: "#fff" }}>
            <ReactQuill
              theme="snow"
              value={misi}
              onChange={setMisi}
              modules={modules}
            />
          </div>
        </div>

        {/* PROFIL LULUSAN */}
        <div className="form-group">
          <label>Profil Lulusan & Prospek Kerja</label>
          <div style={{ background: "#fff" }}>
            <ReactQuill
              theme="snow"
              value={profilLulusan}
              onChange={setProfilLulusan}
              modules={modules}
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
