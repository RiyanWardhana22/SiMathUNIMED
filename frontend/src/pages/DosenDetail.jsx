import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function DosenDetail() {
  const { id } = useParams();
  const [dosen, setDosen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDosenDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          API_URL + `get_dosen_detail.php?id=${id}`
        );

        if (response.data.status === "success") {
          setDosen(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDosenDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="container">
        <p>Loading profil dosen...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ color: "red" }}>
        <p>Error: {error}</p>
        <Link to="/dosen">Kembali ke Daftar Dosen</Link>
      </div>
    );
  }

  return (
    <div className="container">
      {dosen ? (
        <>
          <img
            src={API_URL + `../uploads/images/${dosen.foto_profil}`}
            alt={dosen.nama_dosen}
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              objectFit: "cover",
              float: "left",
              marginRight: "20px",
            }}
          />
          <h2>{dosen.nama_dosen}</h2>
          <p style={{ color: "#555", fontSize: "1.2rem" }}>{dosen.nip}</p>

          <div style={{ clear: "both", paddingTop: "20px" }}>
            <h3>Program Studi:</h3>
            <p>{dosen.nama_prodi}</p>

            <h3>Bidang Keahlian:</h3>
            <p>{dosen.bidang_keahlian}</p>

            <h3>Jadwal Konsultasi:</h3>
            <p>{dosen.jadwal_konsultasi || "Belum diatur"}</p>

            <h3>Link Google Scholar:</h3>
            {dosen.link_google_scholar ? (
              <a
                href={dosen.link_google_scholar}
                target="_blank"
                rel="noopener noreferrer"
              >
                Lihat Publikasi
              </a>
            ) : (
              <p>Belum ditautkan</p>
            )}
          </div>

          <br />
          <Link to="/dosen">Kembali ke Daftar Dosen</Link>
        </>
      ) : (
        <p>Data dosen tidak ditemukan.</p>
      )}
    </div>
  );
}

export default DosenDetail;
