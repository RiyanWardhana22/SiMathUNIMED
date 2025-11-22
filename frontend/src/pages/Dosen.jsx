import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Dosen.css";

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
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h2 style={{ fontSize: "2rem", color: "#333", marginBottom: "10px" }}>
          Dosen & Staff Pengajar
        </h2>
        <p style={{ color: "#666" }}>
          Tim pengajar profesional dan berpengalaman di Jurusan Matematika
          UNIMED.
        </p>
        <div
          style={{
            width: "60px",
            height: "4px",
            background: "#004a8d",
            margin: "20px auto",
          }}
        ></div>
      </div>

      {loading && (
        <p style={{ textAlign: "center" }}>Mengambil data dosen...</p>
      )}

      {error && (
        <div
          style={{
            color: "red",
            border: "1px solid red",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <h4>Gagal Mengambil Data</h4>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && dosen && (
        <>
          {dosen.status === "success" ? (
            <div className="dosen-grid">
              {dosen.data.map((item) => (
                <Link
                  to={`/dosen/${item.id_dosen}`}
                  key={item.id_dosen}
                  className="dosen-card-public"
                >
                  <div className="dosen-img-wrapper">
                    <img
                      src={API_URL + `../uploads/images/${item.foto_profil}`}
                      alt={item.nama_dosen}
                      onError={(e) => {
                        e.target.src =
                          API_URL + "../uploads/images/default.jpg";
                      }}
                    />
                  </div>

                  <h3 className="dosen-name">{item.nama_dosen}</h3>
                  <span className="dosen-nip">{item.nip}</span>
                  <span className="dosen-prodi">{item.nama_prodi}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: "center" }}>
              Tidak ada data dosen ditemukan.
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default Dosen;
