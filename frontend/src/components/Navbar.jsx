import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { authUser, logout } = useContext(AuthContext);
  const handleLogout = () => {
    logout();
  };

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
            <Link to="/akademik" className="navbar-link">
              Akademik
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
          {authUser ? (
            <>
              <li className="navbar-item">
                <Link to="/admin/dashboard" className="navbar-link">
                  Dashboard
                </Link>
              </li>
              <li className="navbar-item">
                <span
                  className="navbar-link"
                  style={{ color: "#f7f7f7", cursor: "default" }}
                >
                  Hi, {authUser.nama_lengkap}
                </span>
              </li>
              <li className="navbar-item">
                <button onClick={handleLogout} className="navbar-link-button">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li className="navbar-item">
              <Link to="/login" className="navbar-link">
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
