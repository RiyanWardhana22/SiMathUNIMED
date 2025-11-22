import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../styles/Dosen.css";

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

  if (loading)
    return (
      <div
        className="container"
        style={{ padding: "50px", textAlign: "center" }}
      >
        <p>Loading profil...</p>
      </div>
    );

  if (error)
    return (
      <div
        className="container"
        style={{ color: "red", padding: "50px", textAlign: "center" }}
      >
        <h3>Error</h3>
        <p>{error}</p>
        <Link to="/dosen" className="btn-back-profile">
          &larr; Kembali
        </Link>
      </div>
    );

  return (
    <div className="container">
      {dosen ? (
        <div className="profile-wrapper">
          {/* KOLOM KIRI: SIDEBAR */}
          <div className="profile-sidebar">
            <img
              src={API_URL + `../uploads/images/${dosen.foto_profil}`}
              alt={dosen.nama_dosen}
              className="profile-photo-lg"
              onError={(e) => {
                e.target.src = API_URL + "../uploads/images/default.jpg";
              }}
            />
            <h1 className="profile-name-lg">{dosen.nama_dosen}</h1>
            <span className="profile-nip-lg">{dosen.nip}</span>

            {dosen.link_google_scholar ? (
              <a
                href={dosen.link_google_scholar}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-scholar"
              >
                Google Scholar
              </a>
            ) : (
              <span style={{ color: "#999", fontSize: "0.9rem" }}>
                Google Scholar belum ditautkan
              </span>
            )}

            <br />
            <Link
              to="/dosen"
              className="btn-back-profile"
              style={{ marginTop: "30px", display: "inline-block" }}
            >
              &larr; Kembali ke Daftar
            </Link>
          </div>

          {/* KOLOM KANAN: KONTEN */}
          <div className="profile-content">
            <div className="profile-section">
              <h3>Program Studi</h3>
              <p>{dosen.nama_prodi}</p>
            </div>

            <div className="profile-section">
              <h3>Bidang Keahlian</h3>
              <p>{dosen.bidang_keahlian || "-"}</p>
            </div>

            <div className="profile-section">
              <h3>Riwayat Pendidikan</h3>
              {dosen.pendidikan && dosen.pendidikan.length > 0 ? (
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {dosen.pendidikan.map((edu) => (
                    <li
                      key={edu.id_pendidikan}
                      style={{
                        marginBottom: "15px",
                        paddingBottom: "10px",
                        borderBottom: "1px dashed #eee",
                      }}
                    >
                      <div style={{ fontWeight: "bold", color: "#333" }}>
                        {edu.jenjang} - {edu.jurusan}
                      </div>
                      <div style={{ color: "#666", fontSize: "0.95rem" }}>
                        {edu.universitas} ({edu.tahun_lulus})
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>-</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p style={{ textAlign: "center" }}>Data dosen tidak ditemukan.</p>
      )}
    </div>
  );
}

export default DosenDetail;
