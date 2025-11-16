import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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

      {loading && <p>Mengambil data dari server...</p>}

      {error && (
        <div style={{ color: "red", border: "1px solid red", padding: "10px" }}>
          <h4>Gagal Mengambil Data:</h4>
          <p>{error}</p>
          <small>Pastikan server Laragon (Apache & MySQL) Anda berjalan.</small>
        </div>
      )}

      {!loading && !error && prodi && (
        <>
          {prodi.status === "success" ? (
            <ul>
              {/* 2. UBAH BAGIAN INI */}
              {prodi.data.map((item) => (
                <li key={item.id_prodi}>
                  {/* Buat link dinamis ke /prodi/ID_PRODI */}
                  <Link to={`/prodi/${item.id_prodi}`}>{item.nama_prodi}</Link>
                </li>
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
