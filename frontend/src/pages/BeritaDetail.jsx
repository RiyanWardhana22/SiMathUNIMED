import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../styles/BeritaDetail.css";

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

  if (loading)
    return (
      <div
        className="container"
        style={{ textAlign: "center", padding: "50px" }}
      >
        <div className="loader"></div> Loading...
      </div>
    );

  if (error)
    return (
      <div
        className="container"
        style={{ textAlign: "center", padding: "50px", color: "red" }}
      >
        <h3>Error</h3>
        <p>{error}</p>
        <Link to="/berita" className="btn-back">
          &larr; Kembali ke Berita
        </Link>
      </div>
    );

  return (
    <div className="berita-detail-wrapper">
      <div className="berita-header">
        <div className="container">
          <h1>{post.judul}</h1>
          <div className="meta-info">
            <span className={`kategori-badge ${post.kategori}`}>
              {post.kategori}
            </span>
            <span>📅 {formatDate(post.tanggal_publish)}</span>
            <span>👤 {post.nama_penulis || "Admin"}</span>
          </div>
        </div>
      </div>

      <div className="container berita-body-container">
        {/* Gambar Header */}
        {post.gambar_header && (
          <div className="berita-featured-image">
            <img
              src={API_URL + `../uploads/images/${post.gambar_header}`}
              alt={post.judul}
            />
          </div>
        )}

        {/* ISI BERITA (RENDER HTML) */}
        <div
          className="berita-content"
          dangerouslySetInnerHTML={{ __html: post.isi_berita }}
        />

        <div className="berita-footer">
          <Link to="/berita" className="btn-back">
            &larr; Kembali ke Daftar Berita
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BeritaDetail;
