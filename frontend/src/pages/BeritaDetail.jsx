import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../styles/Berita.css";

const API_URL = import.meta.env.VITE_API_URL;

function BeritaDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBeritaDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          API_URL + `get_berita_detail.php?slug=${slug}`
        );

        if (response.data.status === "success") {
          setPost(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBeritaDetail();
  }, [slug]);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  if (loading) {
    return (
      <div className="container">
        <p>Loading postingan...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container" style={{ color: "red" }}>
        <p>Error: {error}</p>
        <Link to="/berita">Kembali ke Daftar Berita</Link>
      </div>
    );
  }

  return (
    <div className="container">
      {post ? (
        <div className="berita-detail-content">
          <h2>{post.judul}</h2>

          <div className="berita-card-meta" style={{ marginBottom: "20px" }}>
            <span className={`berita-card-kategori ${post.kategori}`}>
              {post.kategori}
            </span>
            <br />
            Dipublish pada {formatDate(post.tanggal_publish)}
            {post.nama_penulis && ` oleh ${post.nama_penulis}`}
          </div>

          <img
            src={API_URL + `../uploads/images/${post.gambar_header}`}
            alt={post.judul}
            className="berita-card-image"
            style={{ marginBottom: "20px" }}
          />

          {/* Ini adalah tempat isi artikel lengkap ditampilkan */}
          <div className="isi-berita">
            <p>{post.isi_berita}</p>
            {/* Nanti jika 'isi_berita' Anda adalah HTML, 
              kita akan perlu mengubah <p>{post.isi_berita}</p> 
              menjadi sesuatu yang bisa render HTML. 
              Tapi untuk saat ini, ini sudah cukup.
            */}
          </div>

          <br />
          <Link to="/berita">Kembali ke Daftar Berita</Link>
        </div>
      ) : (
        <p>Postingan tidak ditemukan.</p>
      )}
    </div>
  );
}

export default BeritaDetail;
