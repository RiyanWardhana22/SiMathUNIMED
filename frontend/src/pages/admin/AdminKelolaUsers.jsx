import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import "../../styles/AdminTable.css";
import { FaTrashAlt, FaPencilAlt } from "react-icons/fa";

function AdminKelolaUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/get_users.php");
      if (res.data.status === "success") {
        setUsers(res.data.data);
      } else {
        setUsers([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengambil data user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Yakin ingin menghapus pengguna ini? Akses mereka akan dicabut."
      )
    )
      return;

    try {
      const res = await api.post("/delete_user.php", { id });
      if (res.data.status === "success") {
        alert("Pengguna dihapus.");
        fetchUsers();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Terjadi kesalahan.");
    }
  };

  if (loading)
    return (
      <div className="container">
        <p>Loading users...</p>
      </div>
    );
  if (error)
    return (
      <div className="container">
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Manajemen Pengguna</h2>
        <Link to="/admin/users/tambah" className="btn-primary">
          + Tambah Pengguna
        </Link>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Nama Lengkap</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id_user}>
              <td>{user.nama_lengkap}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <span
                  className="kategori-badge"
                  style={{ backgroundColor: "#555" }}
                >
                  {user.role}
                </span>
              </td>
              <td>
                <Link
                  to={`/admin/users/edit/${user.id_user}`}
                  className="btn-edit"
                >
                  <FaPencilAlt />
                </Link>
                <button
                  onClick={() => handleDelete(user.id_user)}
                  className="btn-hapus"
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminKelolaUsers;
