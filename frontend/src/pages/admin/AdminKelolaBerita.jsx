import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import "../../styles/AdminTable.css";
import { FaTrashAlt, FaPencilAlt } from "react-icons/fa";

function AdminKelolaBerita() {
  const [postingan, setPostingan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBerita = async () => {
    try {
      const response = await api.get("/get_berita.php");
      if (response.data.status === "success") {
        setPostingan(response.data.data);
      } else {
        setPostingan([]);
      }
    } catch (err) {
      setError(err.message || "Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBerita();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus postingan ini?")) {
      return;
    }
    try {
      const response = await api.post("/delete_berita.php", { id: id });
      if (response.data.status === "success") {
        alert("Berhasil dihapus!");
        setPostingan(postingan.filter((item) => item.id_berita !== id));
      } else {
        alert("Gagal menghapus: " + response.data.message);
      }
    } catch (err) {
      console.error(err);
      alert(
        "Terjadi kesalahan: " + (err.response?.data?.message || err.message)
      );
    }
  };

  if (loading)
    return (
      <div className="container">
        <p>Loading data berita...</p>
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
        <h2>Kelola Berita & Event</h2>
        <Link to="/admin/berita/tambah" className="btn-primary">
          + Tambah Baru
        </Link>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Judul</th>
            <th>Kategori</th>
            <th>Tanggal Publish</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {postingan.length > 0 ? (
            postingan.map((item) => (
              <tr key={item.id_berita}>
                <td>{item.judul}</td>
                <td>
                  <span className={`kategori-badge ${item.kategori}`}>
                    {item.kategori}
                  </span>
                </td>
                <td>{formatDate(item.tanggal_publish)}</td>
                <td style={{ display: "flex" }}>
                  <Link
                    to={`/admin/berita/edit/${item.id_berita}`}
                    className="btn-edit"
                  >
                    <FaPencilAlt />
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id_berita)}
                    className="btn-hapus"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                Tidak ada data postingan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminKelolaBerita;
