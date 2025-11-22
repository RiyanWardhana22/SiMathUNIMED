import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaBars, FaTimes } from "react-icons/fa";
import "../styles/Navbar.css";

function Navbar() {
  const { authUser, logout } = useContext(AuthContext);
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* LOGO */}
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          SiMathUNIMED
        </Link>

        {/* IKON HAMBURGER (Hanya muncul di Mobile) */}
        <div className="menu-icon" onClick={handleClick}>
          {click ? <FaTimes /> : <FaBars />}
        </div>

        {/* MENU LINKS */}
        <ul className={click ? "navbar-menu active" : "navbar-menu"}>
          <li className="navbar-item">
            <Link to="/" className="navbar-link" onClick={closeMobileMenu}>
              Beranda
            </Link>
          </li>
          <li className="navbar-item">
            <Link
              to="/profil"
              className="navbar-link"
              onClick={closeMobileMenu}
            >
              Profil Jurusan
            </Link>
          </li>
          <li className="navbar-item">
            <Link
              to="/akademik"
              className="navbar-link"
              onClick={closeMobileMenu}
            >
              Akademik
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/dosen" className="navbar-link" onClick={closeMobileMenu}>
              Dosen
            </Link>
          </li>
          <li className="navbar-item">
            <Link
              to="/berita"
              className="navbar-link"
              onClick={closeMobileMenu}
            >
              Berita
            </Link>
          </li>

          {/* AUTH LINKS */}
          {authUser ? (
            <>
              <li className="navbar-item">
                <Link
                  to="/admin/dashboard"
                  className="navbar-link"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
              </li>
              <li className="navbar-item">
                <button onClick={handleLogout} className="navbar-link-button">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li className="navbar-item">
              <Link
                to="/login"
                className="navbar-link"
                onClick={closeMobileMenu}
              >
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
