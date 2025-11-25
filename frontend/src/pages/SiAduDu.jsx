import { useState } from "react";
import api from "../api";
import "../styles/SiAduDu.css";
import {
  FaSearch,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationCircle,
  FaTicketAlt,
  FaFileUpload,
} from "react-icons/fa";

function SiAduDu() {
  const [activeTab, setActiveTab] = useState("buat");
  const [klasifikasi, setKlasifikasi] = useState("Pengaduan");
  const [kategori, setKategori] = useState("");
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [ticketResult, setTicketResult] = useState(null);
  const [searchTicket, setSearchTicket] = useState("");
  const [trackResult, setTrackResult] = useState(null);
  const [trackError, setTrackError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("klasifikasi", klasifikasi);
    formData.append("kategori", kategori);
    formData.append("judul", judul);
    formData.append("isi", isi);
    if (file) formData.append("lampiran", file);

    try {
      const res = await api.post("/create_pengaduan.php", formData);
      if (res.data.status === "success") {
        setTicketResult(res.data.ticket);
        setKlasifikasi("Pengaduan");
        setKategori("");
        setJudul("");
        setIsi("");
        setFile(null);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert("Terjadi kesalahan server.");
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTrackResult(null);
    setTrackError(null);

    try {
      const res = await api.get(`/track_pengaduan.php?tiket=${searchTicket}`);
      if (res.data.status === "success") {
        setTrackResult(res.data.data);
      } else {
        setTrackError("Kode tiket tidak ditemukan. Pastikan kode benar.");
      }
    } catch (err) {
      setTrackError("Gagal koneksi ke server.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Menunggu":
        return "#f0ad4e";
      case "Diproses":
        return "#007bff";
      case "Selesai":
        return "#28a745";
      case "Ditolak":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  return (
    <div className="siadudu-wrapper">
      <div className="siadudu-hero">
        <h1>SiAduDu</h1>
        <p>
          Sistem Pengaduan Terpadu - Suarakan aspirasi dan keluhan Anda secara
          aman dan anonim.
        </p>
      </div>

      {/* 2. MAIN CARD */}
      <div className="siadudu-card-container">
        <div className="siadudu-card">
          <div className="siadudu-tabs">
            <button
              className={`siadudu-tab ${activeTab === "buat" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("buat");
                setTicketResult(null);
              }}
            >
              <FaPaperPlane /> Buat Laporan
            </button>
            <button
              className={`siadudu-tab ${activeTab === "cek" ? "active" : ""}`}
              onClick={() => setActiveTab("cek")}
            >
              <FaSearch /> Cek Status
            </button>
          </div>

          {/* FORM AREA */}
          <div className="siadudu-form-area">
            {activeTab === "buat" && !ticketResult && (
              <form onSubmit={handleSubmit}>
                <h3 className="form-section-title">Informasi Laporan</h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <label className="input-label">Jenis Laporan</label>
                    <select
                      className="siadudu-input"
                      value={klasifikasi}
                      onChange={(e) => setKlasifikasi(e.target.value)}
                    >
                      <option value="Pengaduan">Pengaduan (Keluhan)</option>
                      <option value="Aspirasi">Aspirasi (Saran)</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Kategori</label>
                    <select
                      className="siadudu-input"
                      value={kategori}
                      onChange={(e) => setKategori(e.target.value)}
                      required
                    >
                      <option value="">-- Pilih Kategori --</option>
                      <option value="Akademik">Akademik</option>
                      <option value="Sarana">Sarana & Prasarana</option>
                      <option value="Administrasi">Administrasi</option>
                      <option value="Etika">Etika & Disiplin</option>
                      <option value="Kemahasiswaan">Kemahasiswaan</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label className="input-label">Judul Laporan</label>
                  <input
                    type="text"
                    className="siadudu-input"
                    placeholder="Contoh: Proyektor di Ruang 301 Rusak"
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    required
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label className="input-label">Detail Laporan</label>
                  <textarea
                    className="siadudu-input"
                    rows="5"
                    placeholder="Jelaskan kronologi atau detail masalah secara lengkap..."
                    value={isi}
                    onChange={(e) => setIsi(e.target.value)}
                    required
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label className="input-label">
                    Bukti Lampiran (Opsional)
                  </label>
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      id="file-upload"
                      onChange={(e) => setFile(e.target.files[0])}
                      style={{ display: "none" }}
                    />
                    <label
                      htmlFor="file-upload"
                      style={{ cursor: "pointer", width: "100%" }}
                    >
                      <FaFileUpload size={24} color="#004a8d" />
                      <p
                        style={{
                          margin: "5px 0 0",
                          fontSize: "0.9rem",
                          color: "#666",
                        }}
                      >
                        {file ? file.name : "Klik untuk upload foto/dokumen"}
                      </p>
                    </label>
                  </div>
                </div>

                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? "Sedang Mengirim..." : "Kirim Laporan"}
                </button>
              </form>
            )}

            {/* --- STATE 2: SUKSES TIKET --- */}
            {activeTab === "buat" && ticketResult && (
              <div className="ticket-success-card">
                <FaCheckCircle
                  size={60}
                  color="#28a745"
                  style={{ marginBottom: "20px" }}
                />
                <h2 style={{ color: "#333", marginBottom: "10px" }}>
                  Laporan Berhasil Dikirim!
                </h2>
                <p style={{ color: "#666" }}>
                  Laporan Anda telah kami terima secara anonim.
                </p>

                <div className="ticket-box">{ticketResult}</div>

                <div
                  style={{
                    background: "#fff3cd",
                    color: "#856404",
                    padding: "15px",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                  }}
                >
                  <strong>PENTING:</strong> Simpan kode tiket di atas! Ini
                  adalah satu-satunya kunci untuk melihat tanggapan admin
                  terhadap laporan Anda.
                </div>

                <button
                  className="btn-submit"
                  onClick={() => {
                    setTicketResult(null);
                    setActiveTab("cek");
                    setSearchTicket(ticketResult);
                  }}
                >
                  Cek Status Sekarang
                </button>
              </div>
            )}

            {/* --- STATE 3: CEK STATUS --- */}
            {activeTab === "cek" && (
              <div>
                <form
                  onSubmit={handleTrack}
                  style={{ display: "flex", gap: "10px", marginBottom: "30px" }}
                >
                  <input
                    type="text"
                    className="siadudu-input"
                    placeholder="Masukkan Kode Tiket (Misal: ADU-X1Y2)"
                    value={searchTicket}
                    onChange={(e) => setSearchTicket(e.target.value)}
                    required
                    style={{ fontWeight: "bold", letterSpacing: "1px" }}
                  />
                  <button
                    type="submit"
                    className="btn-submit"
                    style={{ width: "auto", padding: "0 30px", marginTop: 0 }}
                  >
                    <FaSearch />
                  </button>
                </form>

                {trackError && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      color: "#dc3545",
                      background: "#fff5f5",
                      borderRadius: "8px",
                    }}
                  >
                    <FaExclamationCircle
                      size={30}
                      style={{ marginBottom: "10px" }}
                    />
                    <p>{trackError}</p>
                  </div>
                )}

                {trackResult && (
                  <div className="track-result-card">
                    <div className="track-header">
                      <div>
                        <span
                          style={{
                            display: "block",
                            fontSize: "0.8rem",
                            color: "#888",
                          }}
                        >
                          Kode Tiket
                        </span>
                        <strong style={{ fontSize: "1.2rem", color: "#333" }}>
                          {trackResult.kode_tiket}
                        </strong>
                      </div>
                      <span
                        className="status-badge"
                        style={{
                          background: getStatusColor(trackResult.status),
                        }}
                      >
                        {trackResult.status}
                      </span>
                    </div>

                    <div className="track-body">
                      <h3 style={{ fontSize: "1.3rem", marginBottom: "10px" }}>
                        {trackResult.judul}
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          gap: "15px",
                          fontSize: "0.85rem",
                          color: "#666",
                          marginBottom: "20px",
                        }}
                      >
                        <span>
                          📅{" "}
                          {new Date(
                            trackResult.tanggal_buat
                          ).toLocaleDateString()}
                        </span>
                        <span>📂 {trackResult.kategori}</span>
                      </div>

                      <p
                        style={{
                          lineHeight: "1.6",
                          color: "#444",
                          background: "#f9f9f9",
                          padding: "15px",
                          borderRadius: "8px",
                        }}
                      >
                        {trackResult.isi}
                      </p>

                      {trackResult.file_path && (
                        <a
                          href={`${
                            import.meta.env.VITE_API_URL
                          }../uploads/documents/${trackResult.file_path}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "inline-block",
                            marginTop: "10px",
                            color: "#004a8d",
                            fontWeight: "600",
                          }}
                        >
                          📎 Lihat Lampiran
                        </a>
                      )}

                      <div className="track-reply">
                        <h4
                          style={{
                            margin: "0 0 10px 0",
                            color: "#004a8d",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <FaExclamationCircle /> Tanggapan Admin
                        </h4>
                        {trackResult.tanggapan_admin ? (
                          <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                            {trackResult.tanggapan_admin}
                          </p>
                        ) : (
                          <p
                            style={{
                              margin: 0,
                              color: "#888",
                              fontStyle: "italic",
                            }}
                          >
                            Belum ada tanggapan. Mohon menunggu.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SiAduDu;
