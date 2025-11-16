import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          SiMathUNIMED
        </Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">
              Beranda
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/profil" className="navbar-link">
              Profil Jurusan
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/dosen" className="navbar-link">
              Dosen
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/berita" className="navbar-link">
              Berita
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
