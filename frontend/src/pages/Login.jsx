import { useState } from "react";
import axios from "axios";
import "../styles/Login.css";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(API_URL + "login.php", {
        username: username,
        password: password,
      });
      if (response.data.status === "success") {
        console.log("Login Berhasil:", response.data.user);
        alert(
          "Login berhasil! Selamat datang, " + response.data.user.nama_lengkap
        );
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan koneksi ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login Admin</h2>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Tampilkan pesan error jika ada */}
        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
