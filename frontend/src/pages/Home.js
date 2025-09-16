import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaUserCircle, FaTrain, FaSearch, FaInfoCircle } from "react-icons/fa";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            Your Journey, Simplified
          </h1>
          <p className="tagline">
            Experience hassle-free train ticket booking and real-time PNR tracking with Rail-Ion.
          </p>
          <div className="cta-buttons">
            <Link to="/search" className="btn btn-primary">
              <FaSearch /> Search Trains
            </Link>
            <Link to="/pnr" className="btn btn-secondary">
              <FaInfoCircle /> Check PNR Status
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Rail-Ion?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Fast & Secure Booking</h3>
            <p>
              Book your tickets in a few simple steps with our fast and secure
              payment gateway.
            </p>
          </div>
          <div className="feature-card">
            <h3>Real-Time PNR Status</h3>
            <p>
              Get instant updates on your booking status and journey details, anytime,
              anywhere.
            </p>
          </div>
          <div className="feature-card">
            <h3>Intuitive Dashboard</h3>
            <p>
              Manage all your bookings and passenger information from a single,
              user-friendly dashboard.
            </p>
          </div>
          <div className="feature-card">
            <h3>Quick Checkout</h3>
            <p>
              Save your details to complete your future bookings in no time.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step-card">
            <span className="step-number">1</span>
            <h3>Search</h3>
            <p>Find trains by entering your source and destination.</p>
          </div>
          <div className="step-card">
            <span className="step-number">2</span>
            <h3>Book</h3>
            <p>Select your preferred train, class, and travel date.</p>
          </div>
          <div className="step-card">
            <span className="step-number">3</span>
            <h3>Confirm</h3>
            <p>Add passenger details and complete your secure payment.</p>
          </div>
          <div className="step-card">
            <span className="step-number">4</span>
            <h3>Track</h3>
            <p>Get your PNR and track your journey to stay updated.</p>
          </div>
        </div>
      </section>

      {/* About the Developer Section */}
      <section className="developer-section">
        <h2 className="section-title">About the Developer</h2>
        <div className="developer-card">
          <FaUserCircle className="dev-avatar" />
          <h3 className="dev-name">B Srinivasa Ranganath</h3>
          <a
            href="https://github.com/Maverick400x"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
          >
            <FaGithub className="github-icon" />
            My GitHub Profile
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>
          <FaTrain /> Powered by Rail-Ion | Making train journeys simpler and smarter <FaTrain />
        </p>
      </footer>
    </div>
  );
};

export default Home;