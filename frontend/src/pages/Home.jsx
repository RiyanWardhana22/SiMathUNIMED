import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost/SiMathUNIMED/backend/";

function Home() {
  const [prodi, setProdi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProdi = async () => {
      setError(null);
      try {
        const response = await axios.get(API_URL + "get_prodi.php");
        setProdi(response.data);
      } catch (err) {
        console.error("Terjadi kesalahan:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProdi();
  }, []);

  return (
    <div className="container">
      <h2>Selamat Datang di Beranda SiMathUNIMED</h2>
      <p>Ini adalah halaman utama website jurusan.</p>

      <h3>Daftar Program Studi</h3>

      {/* 1. Tampilkan status Loading */}
      {loading && <p>Mengambil data dari server...</p>}

      {/* 2. Tampilkan status Error JIKA ADA */}
      {error && (
        <div style={{ color: "red", border: "1px solid red", padding: "10px" }}>
          <h4>Gagal Mengambil Data:</h4>
          <p>{error}</p>
          <small>Pastikan server Laragon (Apache & MySQL) Anda berjalan.</small>
        </div>
      )}

      {/* 3. Tampilkan data HANYA JIKA tidak loading DAN tidak error */}
      {!loading && !error && prodi && (
        <>
          {prodi.status === "success" ? (
            <ul>
              {prodi.data.map((item) => (
                <li key={item.id_prodi}>{item.nama_prodi}</li>
              ))}
            </ul>
          ) : (
            <p>{prodi.message}</p>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
