import { useState } from "react";
import api from "../api";
import "../styles/Login.css";
import {
  FaSearch,
  FaPaperPlane,
  FaTicketAlt,
  FaCheckCircle,
  FaExclamationCircle,
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
        setTrackError("Kode tiket tidak ditemukan.");
      }
    } catch (err) {
      setTrackError("Gagal koneksi.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Menunggu":
        return "#f0ad4e";
      case "Diproses":
        return "#5bc0de";
      case "Selesai":
        return "#5cb85c";
      case "Ditolak":
        return "#d9534f";
      default:
        return "#777";
    }
  };

  return (
    <div
      className="container"
      style={{ padding: "40px 20px", maxWidth: "800px" }}
    >
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ color: "#004a8d", fontWeight: "800", fontSize: "2.5rem" }}>
          SiAduDu
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#666" }}>
          Sistem Pengaduan Terpadu - Identitas Anda Aman (Anonim)
        </p>
      </div>

      {/* TAB NAVIGATION */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "30px",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => setActiveTab("buat")}
          style={{
            padding: "12px 30px",
            borderRadius: "30px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            background: activeTab === "buat" ? "#004a8d" : "#eee",
            color: activeTab === "buat" ? "#fff" : "#555",
          }}
        >
          <FaPaperPlane style={{ marginRight: "8px" }} /> Buat Laporan
        </button>
        <button
          onClick={() => setActiveTab("cek")}
          style={{
            padding: "12px 30px",
            borderRadius: "30px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            background: activeTab === "cek" ? "#004a8d" : "#eee",
            color: activeTab === "cek" ? "#fff" : "#555",
          }}
        >
          <FaSearch style={{ marginRight: "8px" }} /> Cek Status
        </button>
      </div>

      {/* --- TAB 1: BUAT LAPORAN --- */}
      {activeTab === "buat" &&
        (!ticketResult ? (
          <form
            className="login-form"
            onSubmit={handleSubmit}
            style={{ maxWidth: "100%" }}
          >
            <div className="form-group">
              <label>Jenis Laporan</label>
              <select
                value={klasifikasi}
                onChange={(e) => setKlasifikasi(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                <option value="Pengaduan">Pengaduan (Keluhan)</option>
                <option value="Aspirasi">Aspirasi (Saran/Masukan)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Kategori</label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                <option value="">-- Pilih Kategori --</option>
                <option value="Akademik">Akademik & Perkuliahan</option>
                <option value="Sarana">Sarana & Prasarana</option>
                <option value="Administrasi">Pelayanan Administrasi</option>
                <option value="Etika">Etika & Disiplin</option>
                <option value="Kemahasiswaan">Kemahasiswaan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div className="form-group">
              <label>Judul Laporan</label>
              <input
                type="text"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                required
                placeholder="Contoh: AC di Ruang 201 Rusak"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div className="form-group">
              <label>Isi Laporan (Detail)</label>
              <textarea
                value={isi}
                onChange={(e) => setIsi(e.target.value)}
                required
                rows="5"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div className="form-group">
              <label>Bukti Lampiran (Opsional - Foto/Dokumen)</label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              <small style={{ color: "#999" }}>
                Identitas Anda tidak akan disimpan.
              </small>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Mengirim..." : "Kirim Laporan (Anonim)"}
            </button>
          </form>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              background: "#e6fffa",
              borderRadius: "12px",
              border: "2px solid #38b2ac",
            }}
          >
            <FaCheckCircle size={50} color="#38b2ac" />
            <h2 style={{ color: "#2c7a7b" }}>Laporan Terkirim!</h2>
            <p>Mohon simpan Kode Tiket ini untuk melihat balasan admin:</p>

            <div
              style={{
                background: "#fff",
                padding: "15px",
                fontSize: "2rem",
                fontWeight: "bold",
                letterSpacing: "2px",
                margin: "20px 0",
                border: "2px dashed #38b2ac",
                color: "#333",
              }}
            >
              {ticketResult}
            </div>

            <p style={{ color: "#d9534f", fontWeight: "bold" }}>
              PENTING: Jangan sampai hilang! Kami tidak menyimpan data pribadi
              Anda, jadi ini satu-satunya cara untuk melacak laporan.
            </p>

            <button
              onClick={() => {
                setTicketResult(null);
                setActiveTab("cek");
                setSearchTicket(ticketResult);
              }}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                background: "#004a8d",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Cek Status Sekarang
            </button>
          </div>
        ))}

      {/* --- TAB 2: CEK STATUS --- */}
      {activeTab === "cek" && (
        <div className="login-form" style={{ maxWidth: "100%" }}>
          <form
            onSubmit={handleTrack}
            style={{ display: "flex", gap: "10px", marginBottom: "30px" }}
          >
            <input
              type="text"
              placeholder="Masukkan Kode Tiket (Misal: ADU-X1Y2)"
              value={searchTicket}
              onChange={(e) => setSearchTicket(e.target.value)}
              required
              style={{
                flex: 1,
                padding: "12px",
                border: "2px solid #004a8d",
                borderRadius: "4px",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            />
            <button
              type="submit"
              style={{
                background: "#004a8d",
                color: "#fff",
                border: "none",
                padding: "0 20px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              <FaSearch />
            </button>
          </form>

          {trackError && (
            <p style={{ color: "red", textAlign: "center" }}>{trackError}</p>
          )}

          {trackResult && (
            <div
              style={{
                border: "1px solid #eee",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background: "#f9f9f9",
                  padding: "15px",
                  borderBottom: "1px solid #eee",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                  #{trackResult.kode_tiket}
                </span>
                <span
                  style={{
                    background: getStatusColor(trackResult.status),
                    color: "#fff",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                  }}
                >
                  {trackResult.status}
                </span>
              </div>

              <div style={{ padding: "20px" }}>
                <h3 style={{ marginTop: 0 }}>{trackResult.judul}</h3>
                <p
                  style={{
                    color: "#666",
                    fontSize: "0.9rem",
                    marginBottom: "5px",
                  }}
                >
                  {trackResult.klasifikasi} - {trackResult.kategori}
                </p>
                <p
                  style={{
                    background: "#f5f5f5",
                    padding: "15px",
                    borderRadius: "5px",
                    whiteSpace: "pre-wrap",
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
                      color: "#004a8d",
                      display: "inline-block",
                      marginTop: "10px",
                    }}
                  >
                    Lihat Lampiran
                  </a>
                )}
              </div>

              {/* BALASAN ADMIN */}
              <div
                style={{
                  background: "#eef4fa",
                  padding: "20px",
                  borderTop: "1px solid #dae1e7",
                }}
              >
                <h4 style={{ marginTop: 0, color: "#004a8d" }}>
                  <FaExclamationCircle /> Tanggapan Admin
                </h4>
                {trackResult.tanggapan_admin ? (
                  <p style={{ whiteSpace: "pre-wrap" }}>
                    {trackResult.tanggapan_admin}
                  </p>
                ) : (
                  <p style={{ color: "#888", fontStyle: "italic" }}>
                    Belum ada tanggapan dari admin.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SiAduDu;
