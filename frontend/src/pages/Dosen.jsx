import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function Dosen() {
  const [dosen, setDosen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDosen = async () => {
      setError(null);
      try {
        const response = await axios.get(API_URL + "get_dosen.php");
        setDosen(response.data);
      } catch (err) {
        console.error("Terjadi kesalahan:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDosen();
  }, []);

  return (
    <div className="container">
      <h2>Manajemen Dosen & Staff</h2>
      <p>Daftar dosen pengajar di Jurusan Matematika UNIMED.</p>

      {loading && <p>Mengambil data dosen...</p>}

      {error && (
        <div style={{ color: "red", border: "1px solid red", padding: "10px" }}>
          <h4>Gagal Mengambil Data:</h4>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && dosen && (
        <>
          {dosen.status === "success" ? (
            <div className="dosen-list">
              {dosen.data.map((item) => (
                <div
                  key={item.id_dosen}
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    margin: "10px 0",
                    borderRadius: "5px",
                  }}
                >
                  <img
                    src={API_URL + `../uploads/images/${item.foto_profil}`}
                    alt={item.nama_dosen}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      marginRight: "15px",
                      objectFit: "cover",
                    }}
                  />

                  <Link
                    to={`/dosen/${item.id_dosen}`}
                    style={{ fontWeight: "bold", fontSize: "1.1rem" }}
                  >
                    {item.nama_dosen}
                  </Link>
                  <br />
                  <small style={{ color: "#555" }}>{item.nip}</small>
                  <br />
                  <small>{item.nama_prodi}</small>
                </div>
              ))}
            </div>
          ) : (
            <p>{dosen.message}</p>
          )}
        </>
      )}
    </div>
  );
}

export default Dosen;
