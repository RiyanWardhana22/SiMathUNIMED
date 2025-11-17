import { useState, useEffect } from "react";
import api from "../api";
import "../styles/AdminTable.css";

function Akademik() {
  const [dokumen, setDokumen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDokumen = async () => {
      try {
        const response = await api.get("/get_dokumen.php");
        if (response.data.status === "success") {
          setDokumen(response.data.data);
        } else {
          setDokumen([]);
        }
      } catch (err) {
        setError(err.message || "Gagal mengambil data");
      } finally {
        setLoading(false);
      }
    };
    fetchDokumen();
  }, []);

  const filterDokumenByKategori = (kategori) => {
    return dokumen.filter((doc) => doc.kategori === kategori);
  };

  const renderTabelDokumen = (title, kategori) => {
    const filteredDocs = filterDokumenByKategori(kategori);
    return (
      <div style={{ marginBottom: "30px" }}>
        <h3>{title}</h3>
        {filteredDocs.length > 0 ? (
          <table className="admin-table" style={{ maxWidth: "800px" }}>
            <thead>
              <tr>
                <th>Nama Dokumen</th>
                <th>Terkait Prodi</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr key={doc.id_dokumen}>
                  <td>{doc.nama_dokumen}</td>
                  <td>{doc.nama_prodi || "Jurusan (Umum)"}</td>
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
          <p>Belum ada dokumen untuk kategori ini.</p>
        )}
      </div>
    );
  };

  if (loading)
    return (
      <div className="container">
        <p>Loading data akademik...</p>
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
      <h2>Akademik</h2>
      <p>Temukan panduan, formulir, dan kurikulum yang Anda butuhkan.</p>
      {renderTabelDokumen("Panduan Akademik", "panduan_akademik")}
      {renderTabelDokumen("Formulir Akademik", "formulir_akademik")}
      {renderTabelDokumen("Kurikulum", "kurikulum")}
      {renderTabelDokumen("Silabus", "silabus")}
      {renderTabelDokumen("Lainnya", "lainnya")}
    </div>
  );
}

export default Akademik;
