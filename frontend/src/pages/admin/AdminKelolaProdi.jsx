import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import "../../styles/AdminTable.css";

function AdminKelolaProdi() {
  const [prodiList, setProdiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProdi = async () => {
      try {
        const response = await api.get("/get_prodi.php");
        if (response.data.status === "success") {
          setProdiList(response.data.data);
        } else {
          setProdiList([]);
        }
      } catch (err) {
        setError(err.message || "Gagal mengambil data");
      } finally {
        setLoading(false);
      }
    };
    fetchProdi();
  }, []);

  if (loading)
    return (
      <div className="container">
        <p>Loading data program studi...</p>
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
      <h2>Kelola Program Studi</h2>
      <p>Edit deskripsi, visi, misi, dan profil lulusan untuk setiap prodi.</p>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama Program Studi</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {prodiList.length > 0 ? (
            prodiList.map((prodi) => (
              <tr key={prodi.id_prodi}>
                <td>{prodi.id_prodi}</td>
                <td>{prodi.nama_prodi}</td>
                <td>
                  <Link
                    to={`/admin/prodi/edit/${prodi.id_prodi}`}
                    className="btn-edit"
                  >
                    Edit Detail
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                Tidak ada data program studi.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminKelolaProdi;
