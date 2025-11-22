import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Login.css";

const API_URL = import.meta.env.VITE_API_URL;

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await axios.post(API_URL + "forgot_password.php", {
        email: email,
      });

      if (response.data.status === "success") {
        setMessage(response.data.message);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi atau konfigurasi email server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Lupa Password</h2>
        <p style={{ marginBottom: "15px", fontSize: "0.9rem", color: "#666" }}>
          Masukkan email Anda. Kami akan mengirimkan link untuk mereset
          password.
        </p>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="contoh@email.com"
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {message && (
          <div
            style={{
              color: "green",
              backgroundColor: "#e6fffa",
              border: "1px solid green",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "15px",
            }}
          >
            {message}
          </div>
        )}

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Mengirim..." : "Kirim Link Reset"}
        </button>

        <div style={{ marginTop: "15px", textAlign: "center" }}>
          <Link
            to="/login"
            style={{ color: "#004a8d", textDecoration: "none" }}
          >
            Kembali ke Login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
