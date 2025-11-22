import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import "../styles/ProdiDetail.css";
import { FaAward, FaUniversity } from "react-icons/fa";

function ProdiDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProdiDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/get_prodi_detail.php?id=${id}`);
        if (response.data.status === "success") {
          setData(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProdiDetail();
  }, [id]);

  if (loading)
    return (
      <div
        className="container"
        style={{ textAlign: "center", padding: "50px" }}
      >
        <p>Loading...</p>
      </div>
    );

  if (error)
    return (
      <div
        className="container"
        style={{ color: "red", textAlign: "center", padding: "50px" }}
      >
        <p>Error: {error}</p>
        <Link to="/">Kembali ke Beranda</Link>
      </div>
    );

  return (
    <div className="prodi-page-wrapper">
      {/* 1. HERO SECTION */}
      {data && data.profil && (
        <div className="prodi-hero">
          <div className="hero-content">
            <span className="prodi-subtitle">
              <FaUniversity
                style={{ marginRight: "8px", verticalAlign: "middle" }}
              />
              Fakultas Matematika dan Ilmu Pengetahuan Alam
            </span>

            <h1>{data.profil.nama_prodi}</h1>

            <div className="prodi-badge-hero">
              <FaAward className="badge-icon" />
              <span>
                Akreditasi: {data.profil.akreditasi || "Belum Terakreditasi"}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        {data && data.profil ? (
          <div className="prodi-layout">
            {/* 2. KOLOM UTAMA (KIRI) - Konten Teks */}
            <div className="prodi-main-content">
              <div className="prodi-main-section">
                <h3 className="prodi-section-title">Deskripsi Program Studi</h3>
                <div
                  className="prodi-text-content"
                  dangerouslySetInnerHTML={{
                    __html: data.profil.deskripsi || "<p>Belum ada data.</p>",
                  }}
                />
              </div>

              <div className="prodi-main-section">
                <h3 className="prodi-section-title">Visi</h3>
                <div
                  className="prodi-text-content"
                  dangerouslySetInnerHTML={{
                    __html: data.profil.visi || "<p>Belum ada data.</p>",
                  }}
                />
              </div>

              <div className="prodi-main-section">
                <h3 className="prodi-section-title">Misi</h3>
                <div
                  className="prodi-text-content"
                  dangerouslySetInnerHTML={{
                    __html: data.profil.misi || "<p>Belum ada data.</p>",
                  }}
                />
              </div>

              <div className="prodi-main-section">
                <h3 className="prodi-section-title">
                  Profil Lulusan & Prospek Kerja
                </h3>
                <div
                  className="prodi-text-content"
                  dangerouslySetInnerHTML={{
                    __html:
                      data.profil.profil_lulusan || "<p>Belum ada data.</p>",
                  }}
                />
              </div>
            </div>

            {/* 3. SIDEBAR (KANAN) - Dosen & Dokumen */}
            <div className="prodi-sidebar">
              <div className="prodi-sidebar-card">
                <h4 className="sidebar-title">Dosen Pengajar</h4>
                {data.dosen && data.dosen.length > 0 ? (
                  <div className="mini-dosen-list">
                    {data.dosen.map((dosen) => (
                      <div key={dosen.id_dosen} className="mini-dosen-item">
                        <img
                          src={`${
                            import.meta.env.VITE_API_URL
                          }../uploads/images/${dosen.foto_profil}`}
                          alt={dosen.nama_dosen}
                          className="mini-dosen-img"
                          onError={(e) => {
                            e.target.src = `${
                              import.meta.env.VITE_API_URL
                            }../uploads/images/default.jpg`;
                          }}
                        />
                        <div className="mini-dosen-info">
                          <h4>
                            <Link to={`/dosen/${dosen.id_dosen}`}>
                              {dosen.nama_dosen}
                            </Link>
                          </h4>
                          <span className="mini-dosen-skill">
                            {dosen.bidang_keahlian || "Dosen Prodi"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "#777", fontSize: "0.9rem" }}>
                    Belum ada data dosen.
                  </p>
                )}
              </div>

              {/* Widget Dokumen */}
              <div className="prodi-sidebar-card">
                <h4 className="sidebar-title">Dokumen Akademik</h4>
                {data.dokumen && data.dokumen.length > 0 ? (
                  <div className="mini-doc-list">
                    {data.dokumen.map((doc) => (
                      <div key={doc.id_dokumen} className="mini-doc-item">
                        <span className="mini-doc-name">
                          {doc.nama_dokumen}
                        </span>
                        <a
                          href={`${
                            import.meta.env.VITE_API_URL
                          }../uploads/documents/${doc.file_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mini-doc-dl"
                        >
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "#777", fontSize: "0.9rem" }}>
                    Belum ada dokumen.
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p>Data prodi tidak ditemukan.</p>
        )}
      </div>
    </div>
  );
}

export default ProdiDetail;
