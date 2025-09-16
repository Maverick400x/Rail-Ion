// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { FaUserCircle, FaEnvelope, FaUser } from "react-icons/fa"; // 👈 New icons
import API from "../api/api";
import "../styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view this page.");
          setLoading(false);
          return;
        }

        const { data } = await API.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(data.user);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile. Please try again later.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="profile-container loading-state">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="profile-container error-state">
        <p className="profile-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card-container">
        <div className="profile-card-header">
          <FaUserCircle className="profile-avatar-icon" />
          <h2 className="profile-name">{user?.name}</h2>
        </div>
        <div className="profile-info-section">
          <div className="info-item">
            <FaUser className="info-icon" />
            <p className="info-text">
              <strong>Username:</strong> {user?.username}
            </p>
          </div>
          <div className="info-item">
            <FaEnvelope className="info-icon" />
            <p className="info-text">
              <strong>Email:</strong> {user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;