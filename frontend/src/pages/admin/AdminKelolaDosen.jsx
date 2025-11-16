import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import "../../styles/AdminTable.css";

function AdminKelolaDosen() {
  const [dosen, setDosen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDosen = async () => {
    try {
      const response = await api.get("/get_dosen.php");
      if (response.data.status === "success") {
        setDosen(response.data.data);
      } else {
        setDosen([]);
      }
    } catch (err) {
      setError(err.message || "Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDosen();
  }, []);

  if (loading)
    return (
      <div className="container">
        <p>Loading data dosen...</p>
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
        <h2>Kelola Dosen & Staff</h2>
        {/* <Link to="/admin/dosen/tambah" className="btn-primary">+ Tambah Dosen</Link> */}
        {/* (Kita buat tombol tambah nanti) */}
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nama Dosen</th>
            <th>NIP</th>
            <th>Program Studi</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {dosen.length > 0 ? (
            dosen.map((item) => (
              <tr key={item.id_dosen}>
                <td>
                  <img
                    src={`${import.meta.env.VITE_API_URL}../uploads/images/${
                      item.foto_profil
                    }`}
                    alt={item.nama_dosen}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </td>
                <td>{item.nama_dosen}</td>
                <td>{item.nip}</td>
                <td>{item.nama_prodi || "N/A"}</td>
                <td>
                  <Link
                    to={`/admin/dosen/edit/${item.id_dosen}`}
                    className="btn-edit"
                  >
                    Edit
                  </Link>
                  {/* <button onClick={() => {}} className="btn-hapus">Hapus</button> */}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                Tidak ada data dosen.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminKelolaDosen;
