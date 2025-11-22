import { useState, useEffect } from "react";
import api from "../../api";
import {
  FaTrash,
  FaUpload,
  FaImage,
  FaLink,
  FaSortNumericDown,
} from "react-icons/fa";
import "../../styles/AdminTable.css";

function AdminKelolaSlider() {
  const [sliderList, setSliderList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [judul, setJudul] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [urutan, setUrutan] = useState(1);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchSliders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/get_sliders.php");
      if (res.data.status === "success") {
        setSliderList(res.data.data);
      } else {
        setSliderList([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !judul) {
      alert("Judul dan Gambar wajib diisi.");
      return;
    }
    setUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("link_url", linkUrl);
    formData.append("urutan", urutan);
    formData.append("gambar_file", file);

    try {
      const response = await api.post("/upload_slider.php", formData);
      if (response.data.status === "success") {
        setSuccess("Slider berhasil ditambahkan!");
        setJudul("");
        setLinkUrl("");
        setUrutan(1);
        setFile(null);
        setPreviewUrl(null);
        e.target.reset();
        fetchSliders();
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Gagal upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, gambarPath) => {
    if (!window.confirm("Hapus slider ini?")) return;
    try {
      const res = await api.post("/delete_slider.php", {
        id,
        gambar_path: gambarPath,
      });
      if (res.data.status === "success") {
        fetchSliders();
      } else {
        alert("Gagal hapus: " + res.data.message);
      }
    } catch (err) {
      alert("Error koneksi.");
    }
  };

  return (
    <div className="container">
      <h2
        style={{
          marginBottom: "20px",
          borderBottom: "2px solid #f0ad4e",
          paddingBottom: "10px",
          display: "inline-block",
        }}
      >
        Kelola Slider Beranda
      </h2>

      <div
        className="admin-slider-layout"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.5fr",
          gap: "30px",
          alignItems: "start",
        }}
      >
        {/* --- KOLOM KIRI: FORM UPLOAD --- */}
        <div
          className="form-card"
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ marginTop: 0, color: "#004a8d" }}>
            + Tambah Banner Baru
          </h3>

          <form onSubmit={handleUpload}>
            {/* Preview Image Box */}
            <div
              style={{
                width: "100%",
                height: "180px",
                background: "#f4f4f4",
                border: "2px dashed #ccc",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ color: "#aaa" }}>
                  <FaImage size={40} /> <br /> Preview Gambar
                </span>
              )}
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                required
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  cursor: "pointer",
                }}
              />
            </div>

            <div className="form-group">
              <label style={{ fontWeight: "bold" }}>Judul Banner</label>
              <input
                type="text"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Contoh: Seminar Nasional"
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div className="form-group">
              <label style={{ fontWeight: "bold" }}>
                <FaLink /> Link Tujuan (Opsional)
              </label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="/berita/judul-berita"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div className="form-group">
              <label style={{ fontWeight: "bold" }}>
                <FaSortNumericDown /> Urutan Tampil
              </label>
              <input
                type="number"
                value={urutan}
                onChange={(e) => setUrutan(e.target.value)}
                min="1"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
              <small style={{ color: "#777" }}>
                *Angka 1 akan tampil paling awal.
              </small>
            </div>

            {error && (
              <div
                style={{
                  color: "red",
                  background: "#ffe6e6",
                  padding: "10px",
                  borderRadius: "4px",
                  marginBottom: "10px",
                }}
              >
                {error}
              </div>
            )}
            {success && (
              <div
                style={{
                  color: "green",
                  background: "#e6fffa",
                  padding: "10px",
                  borderRadius: "4px",
                  marginBottom: "10px",
                }}
              >
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              style={{
                width: "100%",
                padding: "12px",
                background: "#004a8d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontWeight: "bold",
                cursor: uploading ? "not-allowed" : "pointer",
              }}
            >
              {uploading ? (
                "Mengupload..."
              ) : (
                <>
                  <FaUpload /> Upload Slider
                </>
              )}
            </button>
          </form>
        </div>

        {/* --- KOLOM KANAN: DAFTAR SLIDER --- */}
        <div
          className="list-card"
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ marginTop: 0, color: "#333" }}>Daftar Slider Aktif</h3>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              {" "}
              <table
                className="admin-table"
                style={{ width: "100%", minWidth: "500px" }}
              >
                <thead>
                  <tr style={{ background: "#f7f7f7", textAlign: "left" }}>
                    <th style={{ padding: "10px" }}>Urutan</th>
                    <th style={{ padding: "10px" }}>Gambar</th>
                    <th style={{ padding: "10px" }}>Judul</th>
                    <th style={{ padding: "10px", textAlign: "center" }}>
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sliderList.length > 0 ? (
                    sliderList.map((slider) => (
                      <tr
                        key={slider.id_slider}
                        style={{ borderBottom: "1px solid #eee" }}
                      >
                        <td
                          style={{
                            padding: "10px",
                            textAlign: "center",
                          }}
                        >
                          {slider.urutan}
                        </td>
                        <td style={{ padding: "10px" }}>
                          <img
                            src={`${
                              import.meta.env.VITE_API_URL
                            }../uploads/images/${slider.gambar_path}`}
                            alt="Thumbnail"
                            style={{
                              width: "120px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "4px",
                              border: "1px solid #eee",
                            }}
                          />
                        </td>
                        <td style={{ padding: "10px" }}>
                          <strong
                            style={{ display: "block", fontSize: "1rem" }}
                          >
                            {slider.judul}
                          </strong>
                          <span style={{ fontSize: "0.85rem", color: "#666" }}>
                            Link: {slider.link_url || "-"}
                          </span>
                        </td>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          <button
                            onClick={() =>
                              handleDelete(slider.id_slider, slider.gambar_path)
                            }
                            style={{
                              background: "#d9534f",
                              color: "white",
                              border: "none",
                              padding: "8px 12px",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                            title="Hapus Slider"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        style={{
                          textAlign: "center",
                          padding: "20px",
                          color: "#777",
                        }}
                      >
                        Belum ada slider. Silakan upload di form sebelah kiri.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* CSS Khusus untuk Mobile Responsiveness halaman ini */}
      <style>{`
        @media (max-width: 900px) {
          .admin-slider-layout {
            grid-template-columns: 1fr !important; /* Stack ke bawah di HP */
          }
        }
      `}</style>
    </div>
  );
}

export default AdminKelolaSlider;
