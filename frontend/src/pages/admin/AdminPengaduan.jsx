import { useState, useEffect } from "react";
import api from "../../api";
import "../../styles/AdminTable.css";

function AdminPengaduan() {
  const [aduanList, setAduanList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedAduan, setSelectedAduan] = useState(null);
  const [status, setStatus] = useState("");
  const [tanggapan, setTanggapan] = useState("");

  const fetchAduan = async () => {
    try {
      const res = await api.get("/admin_pengaduan.php");
      if (res.data.status === "success") setAduanList(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAduan();
  }, []);

  const handleOpenModal = (aduan) => {
    setSelectedAduan(aduan);
    setStatus(aduan.status);
    setTanggapan(aduan.tanggapan_admin || "");
  };

  const handleSave = async () => {
    try {
      const res = await api.post("/admin_pengaduan.php", {
        id: selectedAduan.id_pengaduan,
        status: status,
        tanggapan: tanggapan,
      });
      if (res.data.status === "success") {
        alert("Tanggapan tersimpan!");
        setSelectedAduan(null);
        fetchAduan();
      }
    } catch (err) {
      alert("Gagal menyimpan.");
    }
  };

  return (
    <div className="container">
      <h2>Manajemen Pengaduan (SiAduDu)</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Tiket</th>
            <th>Tgl</th>
            <th>Kategori</th>
            <th>Judul</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {aduanList.map((aduan) => (
            <tr key={aduan.id_pengaduan}>
              <td style={{ fontWeight: "bold", color: "#004a8d" }}>
                {aduan.kode_tiket}
              </td>
              <td>
                {new Date(aduan.tanggal_buat).toLocaleDateString("id-ID")}
              </td>
              <td>{aduan.kategori}</td>
              <td>{aduan.judul}</td>
              <td>
                <span
                  className={`kategori-badge`}
                  style={{
                    background:
                      aduan.status === "Menunggu"
                        ? "#f0ad4e"
                        : aduan.status === "Selesai"
                        ? "#5cb85c"
                        : "#5bc0de",
                  }}
                >
                  {aduan.status}
                </span>
              </td>
              <td>
                <button
                  onClick={() => handleOpenModal(aduan)}
                  className="btn-edit"
                >
                  Detail & Balas
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL SEDERHANA */}
      {selectedAduan && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "8px",
              width: "500px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h3>Detail Laporan: {selectedAduan.kode_tiket}</h3>
            <p>
              <strong>Isi:</strong> {selectedAduan.isi}
            </p>
            {selectedAduan.file_path && (
              <a
                href={`${import.meta.env.VITE_API_URL}../uploads/documents/${
                  selectedAduan.file_path
                }`}
                target="_blank"
                rel="noreferrer"
                style={{ color: "blue" }}
              >
                Lihat Lampiran
              </a>
            )}

            <hr style={{ margin: "20px 0" }} />

            <label
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              Update Status:
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
            >
              <option value="Menunggu">Menunggu</option>
              <option value="Diproses">Diproses</option>
              <option value="Selesai">Selesai</option>
              <option value="Ditolak">Ditolak</option>
            </select>

            <label
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              Tanggapan Admin:
            </label>
            <textarea
              rows="5"
              value={tanggapan}
              onChange={(e) => setTanggapan(e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
            />

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setSelectedAduan(null)}
                style={{
                  padding: "10px 20px",
                  background: "#ccc",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                style={{
                  padding: "10px 20px",
                  background: "#004a8d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Kirim Tanggapan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPengaduan;
