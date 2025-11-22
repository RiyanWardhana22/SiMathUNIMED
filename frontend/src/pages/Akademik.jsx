import { useState, useEffect } from "react";
import api from "../api";
import "../styles/Akademik.css";
import { FaSearch, FaFilePdf, FaDownload, FaFileAlt } from "react-icons/fa";

function Akademik() {
  const [dokumen, setDokumen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("semua");
  const [searchTerm, setSearchTerm] = useState("");
  const categories = [
    { id: "semua", label: "Semua Dokumen" },
    { id: "panduan_akademik", label: "Panduan" },
    { id: "formulir_akademik", label: "Formulir" },
    { id: "kurikulum", label: "Kurikulum" },
    { id: "silabus", label: "Silabus" },
    { id: "lainnya", label: "Lainnya" },
  ];

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

  // --- LOGIKA FILTER ---
  const getFilteredDocuments = () => {
    return dokumen.filter((doc) => {
      // 1. Filter by Tab
      const matchCategory =
        activeTab === "semua" ? true : doc.kategori === activeTab;

      // 2. Filter by Search (Judul atau Prodi)
      const searchLower = searchTerm.toLowerCase();
      const matchSearch =
        doc.nama_dokumen.toLowerCase().includes(searchLower) ||
        (doc.nama_prodi && doc.nama_prodi.toLowerCase().includes(searchLower));

      return matchCategory && matchSearch;
    });
  };

  const filteredDocs = getFilteredDocuments();

  if (loading)
    return (
      <div
        className="akademik-container"
        style={{ textAlign: "center", paddingTop: "50px" }}
      >
        <p>Memuat layanan akademik...</p>
      </div>
    );
  if (error)
    return (
      <div
        className="akademik-container"
        style={{ color: "red", textAlign: "center" }}
      >
        <p>{error}</p>
      </div>
    );

  return (
    <div className="akademik-container">
      {/* HEADER */}
      <div className="akademik-header">
        <h2>Layanan Akademik</h2>
        <p>
          Pusat unduhan dokumen, panduan, dan formulir akademik Jurusan
          Matematika.
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="search-box">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Cari dokumen, formulir, atau kurikulum..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABS NAVIGATION */}
      <div className="tabs-container">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`tab-button ${activeTab === cat.id ? "active" : ""}`}
            onClick={() => setActiveTab(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* DOCUMENT GRID */}
      <div className="doc-grid">
        {filteredDocs.length > 0 ? (
          filteredDocs.map((doc) => (
            <div key={doc.id_dokumen} className="doc-card">
              <div className="doc-header">
                <div className="doc-icon-wrapper">
                  {doc.kategori === "formulir_akademik" ? (
                    <FaFileAlt />
                  ) : (
                    <FaFilePdf />
                  )}
                </div>
                <h3 className="doc-title">{doc.nama_dokumen}</h3>
              </div>

              <div className="doc-meta">
                <span className="prodi-badge">{doc.nama_prodi || "Umum"}</span>
                <a
                  href={`${import.meta.env.VITE_API_URL}../uploads/documents/${
                    doc.file_path
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-link"
                >
                  <FaDownload size={12} /> Download
                </a>
              </div>
            </div>
          ))
        ) : (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "40px",
              color: "#999",
            }}
          >
            <p>
              Tidak ada dokumen yang ditemukan untuk kategori atau pencarian
              ini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Akademik;
