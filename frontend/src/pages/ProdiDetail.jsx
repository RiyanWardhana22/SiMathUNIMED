import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import "../styles/AdminTable.css";
import "../styles/Berita.css";
import "../styles/Profil.css";

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

  if (loading) {
    return (
      <div className="container">
        <p>Loading detail program studi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ color: "red" }}>
        <p>Error: {error}</p>
        <Link to="/">Kembali ke Beranda</Link>
      </div>
    );
  }

  return (
    <div className="container">
      {data && data.profil ? (
        <>
          <h2>{data.profil.nama_prodi}</h2>

          <div className="akreditasi-badge">
            Akreditasi: {data.profil.akreditasi || "N/A"}
          </div>

          <h3 style={{ marginTop: "20px" }}>Deskripsi</h3>
          <pre className="profil-content">
            {data.profil.deskripsi || "Belum ada data."}
          </pre>

          <h3>Visi</h3>
          <pre className="profil-content">
            {data.profil.visi || "Belum ada data."}
          </pre>

          <h3>Misi</h3>
          <pre className="profil-content">
            {data.profil.misi || "Belum ada data."}
          </pre>

          <h3>Profil Lulusan & Prospek Kerja</h3>
          <pre className="profil-content">
            {data.profil.profil_lulusan || "Belum ada data."}
          </pre>

          {/* Bagian 2: Daftar Dosen Pengajar */}
          <h3
            style={{
              marginTop: "30px",
              borderTop: "1px solid #eee",
              paddingTop: "20px",
            }}
          >
            Dosen Pengajar
          </h3>
          <div className="dosen-list-prodi">
            {data.dosen && data.dosen.length > 0 ? (
              data.dosen.map((dosen) => (
                <div key={dosen.id_dosen} className="dosen-card">
                  <img
                    src={`${import.meta.env.VITE_API_URL}../uploads/images/${
                      dosen.foto_profil
                    }`}
                    alt={dosen.nama_dosen}
                    className="dosen-card-foto"
                  />
                  <div className="dosen-card-info">
                    <Link
                      to={`/dosen/${dosen.id_dosen}`}
                      className="dosen-card-nama"
                    >
                      {dosen.nama_dosen}
                    </Link>
                    <span className="dosen-card-keahlian">
                      {dosen.bidang_keahlian}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p>Belum ada data dosen untuk program studi ini.</p>
            )}
          </div>

          {/* Bagian 3: Dokumen Terkait (Kurikulum, dll) */}
          <h3
            style={{
              marginTop: "30px",
              borderTop: "1px solid #eee",
              paddingTop: "20px",
            }}
          >
            Dokumen Program Studi
          </h3>
          {data.dokumen && data.dokumen.length > 0 ? (
            <table className="admin-table" style={{ maxWidth: "600px" }}>
              <thead>
                <tr>
                  <th>Nama Dokumen</th>
                  <th>Kategori</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {data.dokumen.map((doc) => (
                  <tr key={doc.id_dokumen}>
                    <td>{doc.nama_dokumen}</td>
                    <td>
                      <span
                        style={{ color: "#000000" }}
                        className={`kategori-badge ${doc.kategori}`}
                      >
                        {doc.kategori}
                      </span>
                    </td>
                    <td>
                      <a
                        href={`${
                          import.meta.env.VITE_API_URL
                        }../uploads/documents/${doc.file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-edit"
                      >
                        Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Belum ada dokumen yang terkait dengan program studi ini.</p>
          )}

          <br />
          <Link to="/">Kembali ke Beranda</Link>
        </>
      ) : (
        <p>Data prodi tidak ditemukan.</p>
      )}
    </div>
  );
}

export default ProdiDetail;
