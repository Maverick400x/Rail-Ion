import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUserPlus, FaUser, FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";
import API from "../api/api";
import "../styles/Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await API.post("/auth/register", form);

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.name);
        navigate("/");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <FaUserPlus className="register-icon" />
          <h2 className="register-title">Create Account</h2>
        </div>
        <form onSubmit={handleSubmit} className="register-form">
          {error && <p className="error-message">{error}</p>}
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
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
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="register-btn">
            {loading ? (
              <>
                <FaSpinner className="spinner" /> Loading...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>
        <p className="login-text">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;