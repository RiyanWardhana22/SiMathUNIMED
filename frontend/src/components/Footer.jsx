import { Link } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>SiMathUNIMED</h3>
          <p>
            Sistem Informasi Jurusan Matematika Universitas Negeri Medan. Wadah
            informasi akademik, kemahasiswaan, dan profil jurusan yang
            terintegrasi.
          </p>
          <div className="social-icons">
            <a href="#" className="social-icon">
              <i class="bx bxl-facebook-circle"></i>
            </a>{" "}
            <a href="#" className="social-icon">
              <i class="bx bxl-instagram-alt"></i>
            </a>{" "}
            <a href="#" className="social-icon">
              <i class="bx bxl-youtube"></i>
            </a>{" "}
          </div>
        </div>

        {/* KOLOM 2: TAUTAN CEPAT */}
        <div className="footer-section">
          <h3>Tautan Cepat</h3>
          <ul>
            <li>
              <Link to="/" className="footer-link">
                Beranda
              </Link>
            </li>
            <li>
              <Link to="/profil" className="footer-link">
                Profil Jurusan
              </Link>
            </li>
            <li>
              <Link to="/berita" className="footer-link">
                Berita & Event
              </Link>
            </li>
            <li>
              <Link to="/dosen" className="footer-link">
                Dosen & Staff
              </Link>
            </li>
            <li>
              <Link to="/akademik" className="footer-link">
                Layanan Akademik
              </Link>
            </li>
          </ul>
        </div>

        {/* KOLOM 3: PROGRAM STUDI */}
        <div className="footer-section">
          <h3>Program Studi</h3>
          <ul>
            <li>
              <Link to="/prodi/1" className="footer-link">
                Pendidikan Matematika
              </Link>
            </li>
            <li>
              <Link to="/prodi/2" className="footer-link">
                Matematika
              </Link>
            </li>
            <li>
              <Link to="/prodi/3" className="footer-link">
                Ilmu Komputer
              </Link>
            </li>
            <li>
              <Link to="/prodi/4" className="footer-link">
                Statistika
              </Link>
            </li>
          </ul>
        </div>

        {/* KOLOM 4: KONTAK */}
        <div className="footer-section">
          <h3>Hubungi Kami</h3>
          <p>
            <strong>Alamat:</strong>
            <br />
            JL WILLEM ISKANDAR PSR V, MEDAN ESTATE, PERCUT SEI TUAN KAB. DELI
            SERDANG, SUMATERA UTARA 20371 INDONESIA
          </p>
          <p>
            <strong>Email:</strong>
            <br />
            matematika@unimed.ac.id
          </p>
          <p>
            <strong>Telepon:</strong>
            <br />
            (061) 6613365
          </p>
        </div>
      </div>

      {/* BAGIAN BAWAH */}
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Jurusan Matematika UNIMED. All Rights
        Reserved.
      </div>
    </footer>
  );
}

export default Footer;
