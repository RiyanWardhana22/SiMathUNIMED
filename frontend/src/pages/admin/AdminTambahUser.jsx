import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api";
import "../../styles/Login.css";

function AdminTambahUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    nama_lengkap: "",
    email: "",
    role: "dosen",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/create_user.php", formData);
      if (res.data.status === "success") {
        alert("Pengguna berhasil ditambahkan!");
        navigate("/admin/users");
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Tambah Pengguna Baru</h2>
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
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
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

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Menyimpan..." : "Tambah Pengguna"}
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

export default AdminTambahUser;
