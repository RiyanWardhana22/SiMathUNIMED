import { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/Login.css";

const API_URL = import.meta.env.VITE_API_URL;

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(API_URL + "reset_password.php", {
        token: token,
        new_password: password,
      });

      if (response.data.status === "success") {
        alert("Password berhasil diubah! Silakan login.");
        navigate("/login");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div
        className="container"
        style={{ textAlign: "center", marginTop: "50px" }}
      >
        <h3>Token tidak valid atau hilang.</h3>
      </div>
    );
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Reset Password Baru</h2>

        <div className="form-group">
          <label htmlFor="password">Password Baru</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Konfirmasi Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Memproses..." : "Ubah Password"}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
