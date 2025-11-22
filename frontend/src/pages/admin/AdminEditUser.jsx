import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../api";
import "../../styles/Login.css";

function AdminEditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id_user: "",
    username: "",
    password: "",
    nama_lengkap: "",
    email: "",
    role: "dosen",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/get_user_by_id.php?id=${id}`);
        if (res.data.status === "success") {
          const user = res.data.data;
          setFormData({
            id_user: user.id_user,
            username: user.username,
            password: "",
            nama_lengkap: user.nama_lengkap,
            email: user.email,
            role: user.role,
          });
        } else {
          setError(res.data.message);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Gagal mengambil data");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await api.post("/update_user.php", formData);
      if (res.data.status === "success") {
        alert("Data pengguna berhasil diperbarui!");
        navigate("/admin/users");
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan server.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="container">
        <p>Loading data...</p>
      </div>
    );

  return (
    <div className="container">
      <h2>Edit Pengguna: {formData.username}</h2>
      <form
        className="login-form"
        onSubmit={handleSubmit}
        style={{ maxWidth: "600px" }}
      >
        <div className="form-group">
          <label htmlFor="nama_lengkap">Nama Lengkap</label>
          <input
            type="text"
            id="nama_lengkap"
            value={formData.nama_lengkap}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password Baru (Opsional)</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Kosongkan jika tidak ingin mengubah password"
            style={{ border: "1px solid #ccc" }}
          />
          <small style={{ color: "#666" }}>
            Biarkan kosong untuk tetap menggunakan password lama.
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="role">Role (Peran)</label>
          <select
            id="role"
            value={formData.role}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="superadmin">Super Admin</option>
            <option value="admin_jurusan">Admin Jurusan</option>
            <option value="admin_prodi">Admin Prodi</option>
            <option value="dosen">Dosen</option>
            <option value="mahasiswa">Mahasiswa</option>
          </select>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="login-button" disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
        <Link
          to="/admin/users"
          style={{ display: "block", marginTop: "15px", textAlign: "center" }}
        >
          Batal
        </Link>
      </form>
    </div>
  );
}

export default AdminEditUser;
