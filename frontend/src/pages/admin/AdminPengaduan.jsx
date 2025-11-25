import { useState, useEffect } from "react";
import api from "../../api";
import "../../styles/AdminPengaduan.css";
import {
  FaSearch,
  FaTimes,
  FaPaperclip,
  FaSave,
  FaFilter,
} from "react-icons/fa";

function AdminPengaduan() {
  const [aduanList, setAduanList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [selectedAduan, setSelectedAduan] = useState(null);
  const [status, setStatus] = useState("");
  const [tanggapan, setTanggapan] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchAduan = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin_pengaduan.php");
      if (res.data.status === "success") {
        setAduanList(res.data.data);
        setFilteredList(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAduan();
  }, []);

  useEffect(() => {
    let result = aduanList;

    if (filterStatus !== "Semua") {
      result = result.filter((item) => item.status === filterStatus);
    }

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.kode_tiket.toLowerCase().includes(lowerTerm) ||
          item.judul.toLowerCase().includes(lowerTerm) ||
          item.kategori.toLowerCase().includes(lowerTerm)
      );
    }

    setFilteredList(result);
  }, [searchTerm, filterStatus, aduanList]);

  const handleOpenModal = (aduan) => {
    setSelectedAduan(aduan);
    setStatus(aduan.status);
    setTanggapan(aduan.tanggapan_admin || "");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.post("/admin_pengaduan.php", {
        id: selectedAduan.id_pengaduan,
        status: status,
        tanggapan: tanggapan,
      });
      if (res.data.status === "success") {
        alert("Tanggapan berhasil disimpan!");
        setSelectedAduan(null);
        fetchAduan();
      }
    } catch (err) {
      alert("Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <div className="aduan-container">
        {/* HEADER & TOOLBAR */}
        <div className="aduan-header">
          <h2>SiAduDu - Sistem Pengaduan Terpadu</h2>

          <div className="aduan-toolbar">
            <div className="search-wrapper">
              <FaSearch className="search-icon-input" />
              <input
                type="text"
                placeholder="Cari Tiket, Judul, atau Kategori..."
                className="aduan-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="aduan-filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="Semua">Semua Status</option>
              <option value="Menunggu">Menunggu</option>
              <option value="Diproses">Diproses</option>
              <option value="Selesai">Selesai</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading data...</p>
        ) : (
          <div className="table-wrapper">
            <table className="aduan-table">
              <thead>
                <tr>
                  <th>Tiket</th>
                  <th>Tanggal</th>
                  <th>Kategori</th>
                  <th>Judul</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.length > 0 ? (
                  filteredList.map((aduan) => (
                    <tr key={aduan.id_pengaduan}>
                      <td>
                        <span className="ticket-code">{aduan.kode_tiket}</span>
                      </td>
                      <td>
                        {new Date(aduan.tanggal_buat).toLocaleDateString(
                          "id-ID"
                        )}
                      </td>
                      <td>{aduan.kategori}</td>
                      <td>
                        {aduan.judul.length > 30
                          ? aduan.judul.substring(0, 30) + "..."
                          : aduan.judul}
                      </td>
                      <td>
                        <span className={`status-pill ${aduan.status}`}>
                          {aduan.status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleOpenModal(aduan)}
                          className="btn-edit"
                          style={{ padding: "6px 15px", fontSize: "0.85rem" }}
                        >
                          Proses
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      style={{
                        textAlign: "center",
                        padding: "30px",
                        color: "#999",
                      }}
                    >
                      Tidak ada data pengaduan yang cocok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODERN MODAL */}
      {selectedAduan && (
        <div className="modal-overlay">
          <div className="modal-content-modern">
            <div className="modal-header">
              <h3>
                Tiket:{" "}
                <span style={{ color: "#004a8d" }}>
                  {selectedAduan.kode_tiket}
                </span>
              </h3>
              <button
                onClick={() => setSelectedAduan(null)}
                className="close-btn"
              >
                <FaTimes />
              </button>
            </div>

            <div className="modal-body-grid">
              {/* KIRI: DETAIL LAPORAN */}
              <div className="modal-left">
                <h4
                  style={{
                    marginBottom: "20px",
                    borderBottom: "2px solid #eee",
                    paddingBottom: "10px",
                  }}
                >
                  Detail Laporan
                </h4>

                <div className="detail-item">
                  <span className="detail-label">Judul</span>
                  <div className="detail-value">{selectedAduan.judul}</div>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Kategori & Tanggal</span>
                  <div className="detail-value">
                    {selectedAduan.klasifikasi} - {selectedAduan.kategori}{" "}
                    <br />
                    <small style={{ color: "#999" }}>
                      {new Date(selectedAduan.tanggal_buat).toLocaleString(
                        "id-ID"
                      )}
                    </small>
                  </div>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Isi Laporan</span>
                  <div className="detail-value isi-box">
                    {selectedAduan.isi}
                  </div>
                </div>

                {selectedAduan.file_path && (
                  <div className="detail-item">
                    <span className="detail-label">Lampiran</span>
                    <a
                      href={`${
                        import.meta.env.VITE_API_URL
                      }../uploads/documents/${selectedAduan.file_path}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: "#004a8d",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <FaPaperclip /> Lihat File Lampiran
                    </a>
                  </div>
                )}
              </div>

              {/* KANAN: TINDAKAN ADMIN */}
              <div className="modal-right">
                <h4
                  style={{
                    marginBottom: "20px",
                    borderBottom: "2px solid #004a8d",
                    paddingBottom: "10px",
                    color: "#004a8d",
                  }}
                >
                  Tindak Lanjut
                </h4>

                <div className="admin-form-group">
                  <label className="admin-label">Update Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="admin-select"
                  >
                    <option value="Menunggu">Menunggu</option>
                    <option value="Diproses">Diproses</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Ditolak">Ditolak</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">
                    Balasan / Tanggapan Admin
                  </label>
                  <textarea
                    value={tanggapan}
                    onChange={(e) => setTanggapan(e.target.value)}
                    className="admin-textarea"
                    placeholder="Tulis tanggapan resmi di sini..."
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setSelectedAduan(null)}
                className="btn-hapus"
                style={{ padding: "10px 20px", borderRadius: "6px" }}
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary"
                style={{
                  padding: "10px 25px",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {saving ? "Menyimpan..." : <> Simpan & Kirim</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPengaduan;
