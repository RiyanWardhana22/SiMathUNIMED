import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../api";
import "../../styles/Login.css";
import "../../styles/AdminTable.css";

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

  // State UI
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // State Riwayat Pendidikan
  const [pendidikanList, setPendidikanList] = useState([]);
  const [newJenjang, setNewJenjang] = useState("S1");
  const [newUniv, setNewUniv] = useState("");
  const [newJurusan, setNewJurusan] = useState("");
  const [newTahun, setNewTahun] = useState("");

  // 1. Fetch Data Dosen & Prodi
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil Detail Dosen
        const dosenRes = await api.get(`/get_dosen_detail.php?id=${id}`);
        if (dosenRes.data.status === "success") {
          const dosen = dosenRes.data.data;
          setNamaDosen(dosen.nama_dosen);
          setNip(dosen.nip);
          setBidangKeahlian(dosen.bidang_keahlian || "");
          setLinkGoogleScholar(dosen.link_google_scholar || "");
          setIdProdi(dosen.id_prodi || "");
          setExistingFoto(dosen.foto_profil || "default.jpg");
          // Set Riwayat Pendidikan
          setPendidikanList(dosenRes.data.data.pendidikan || []);
        } else {
          setError(dosenRes.data.message);
        }

        // Ambil List Prodi
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

  // 2. Fungsi Tambah Pendidikan
  const handleAddPendidikan = async () => {
    if (!newUniv || !newJurusan || !newTahun) {
      alert("Lengkapi data pendidikan.");
      return;
    }
    try {
      const res = await api.post("/update_dosen_pendidikan.php", {
        action: "add",
        id_dosen: id,
        jenjang: newJenjang,
        universitas: newUniv,
        jurusan: newJurusan,
        tahun_lulus: newTahun,
      });
      if (res.data.status === "success") {
        window.location.reload();
      }
    } catch (err) {
      alert("Gagal menambah data.");
    }
  };

  // 3. Fungsi Hapus Pendidikan
  const handleDeletePendidikan = async (id_pend) => {
    if (!confirm("Hapus riwayat ini?")) return;
    try {
      const res = await api.post("/update_dosen_pendidikan.php", {
        action: "delete",
        id_pendidikan: id_pend,
      });
      if (res.data.status === "success") {
        setPendidikanList(
          pendidikanList.filter((item) => item.id_pendidikan !== id_pend)
        );
      }
    } catch (err) {
      alert("Gagal menghapus.");
    }
  };

  // 4. Submit Data Utama Dosen
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
      const response = await api.post("/update_dosen_detail.php", formData);

      if (response.data.status === "success") {
        setSuccess("Data dosen berhasil diperbarui!");
        if (response.data.new_image_path) {
          setExistingFoto(response.data.new_image_path);
        }
        setFotoProfilFile(null);
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

      {/* --- FORM UTAMA --- */}
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
              border: "1px solid #ccc",
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
          {saving ? "Menyimpan..." : "Simpan Perubahan Data Diri"}
        </button>

        <Link
          to="/admin/dosen"
          style={{ display: "inline-block", marginTop: "10px", color: "#555" }}
        >
          Batal
        </Link>

        {/* --- BAGIAN RIWAYAT PENDIDIKAN (YANG SEBELUMNYA HILANG) --- */}
        <hr style={{ margin: "40px 0", borderTop: "2px dashed #eee" }} />

        <h3>Kelola Riwayat Pendidikan</h3>

        {/* Tabel Pendidikan */}
        <table className="admin-table" style={{ marginBottom: "20px" }}>
          <thead>
            <tr>
              <th>Jenjang</th>
              <th>Universitas</th>
              <th>Jurusan</th>
              <th>Tahun</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pendidikanList.length > 0 ? (
              pendidikanList.map((edu) => (
                <tr key={edu.id_pendidikan}>
                  <td>{edu.jenjang}</td>
                  <td>{edu.universitas}</td>
                  <td>{edu.jurusan}</td>
                  <td>{edu.tahun_lulus}</td>
                  <td>
                    <button
                      type="button" // Penting: type="button" agar tidak submit form utama
                      onClick={() => handleDeletePendidikan(edu.id_pendidikan)}
                      className="btn-hapus"
                      style={{ fontSize: "0.8rem", padding: "5px 10px" }}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", color: "#999" }}>
                  Belum ada data pendidikan.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Form Tambah Pendidikan Kecil */}
        <div
          style={{
            background: "#f9f9f9",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #eee",
          }}
        >
          <h4 style={{ marginTop: 0, color: "#004a8d" }}>
            + Tambah Pendidikan
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr 2fr 1fr",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <div>
              <label
                style={{
                  fontSize: "0.8rem",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                Jenjang
              </label>
              <select
                value={newJenjang}
                onChange={(e) => setNewJenjang(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              >
                <option value="S1">S1</option>
                <option value="S2">S2</option>
                <option value="S3">S3</option>
              </select>
            </div>
            <div>
              <label
                style={{
                  fontSize: "0.8rem",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                Universitas
              </label>
              <input
                type="text"
                value={newUniv}
                onChange={(e) => setNewUniv(e.target.value)}
                placeholder="Nama Kampus"
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: "0.8rem",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                Jurusan
              </label>
              <input
                type="text"
                value={newJurusan}
                onChange={(e) => setNewJurusan(e.target.value)}
                placeholder="Jurusan"
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: "0.8rem",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                Tahun
              </label>
              <input
                type="number"
                value={newTahun}
                onChange={(e) => setNewTahun(e.target.value)}
                placeholder="20XX"
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddPendidikan}
            className="btn-primary"
            style={{ width: "auto", padding: "10px 20px" }}
          >
            Simpan Pendidikan
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminEditDosen;
