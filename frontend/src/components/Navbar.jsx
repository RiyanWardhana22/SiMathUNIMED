import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaBars, FaTimes, FaCaretDown } from "react-icons/fa";
import "../styles/Navbar.css";

function Navbar() {
  const { authUser, logout } = useContext(AuthContext);
  const [click, setClick] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => {
    setClick(false);
    setDropdown(false);
  };

  const toggleDropdown = () => {
    if (window.innerWidth < 960) {
      setDropdown(!dropdown);
    }
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          SiMathUNIMED
        </Link>

        <div className="menu-icon" onClick={handleClick}>
          {click ? <FaTimes /> : <FaBars />}
        </div>

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

          <li
            className="navbar-item"
            onMouseEnter={() => setDropdown(true)}
            onMouseLeave={() => setDropdown(false)}
            onClick={toggleDropdown}
          >
            <span className="navbar-link dropdown-toggle">
              Layanan <FaCaretDown className="caret-icon" />
            </span>
            <ul className={dropdown ? "dropdown-menu active" : "dropdown-menu"}>
              <li>
                <Link
                  to="/akademik"
                  className="dropdown-link"
                  onClick={closeMobileMenu}
                >
                  Akademik
                </Link>
              </li>
              <li>
                <Link
                  to="/siadudu"
                  className="dropdown-link"
                  onClick={closeMobileMenu}
                >
                  SiAduDu (Pengaduan)
                </Link>
              </li>
            </ul>
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
