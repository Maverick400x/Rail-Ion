import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaLock, FaSignInAlt, FaSpinner } from "react-icons/fa"; // 👈 New icons
import { Link } from "react-router-dom"; // 👈 For the register link
import API from "../api/api";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await API.post("/auth/login", form);

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.name);
        navigate("/");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <FaSignInAlt className="login-icon" />
          <h2 className="login-title">Sign In</h2>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <p className="error-message">{error}</p>}
          <div className="input-group">
            <FaUserCircle className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="login-btn">
            {loading ? (
              <>
                <FaSpinner className="spinner" /> Loading...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <p className="register-text">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;