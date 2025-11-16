import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost/SiMathUNIMED/backend/";

function ProdiDetail() {
  const { id } = useParams();
  const [prodi, setProdi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProdiDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          API_URL + `get_prodi_detail.php?id=${id}`
        );
        if (response.data.status === "success") {
          setProdi(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError(err.message);
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
      {prodi ? (
        <>
          <h2>{prodi.nama_prodi}</h2>

          <h3>Deskripsi</h3>
          <p>{prodi.deskripsi}</p>

          <h3>Visi</h3>
          <p>{prodi.visi}</p>

          <h3>Misi</h3>
          <p>{prodi.misi}</p>

          {/* Kita bisa tambahkan Profil Lulusan, dll di sini nanti */}

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
