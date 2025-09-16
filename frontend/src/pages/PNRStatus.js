import React, { useState } from "react";
import API from "../api/api";
import BookingCard from "../components/BookingCard";
import { FaSpinner, FaTimesCircle } from "react-icons/fa"; // 👈 New icons
import "../styles/PNRStatus.css";

const PNRStatus = () => {
  const [pnr, setPnr] = useState("");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheck = async (e) => {
    e.preventDefault();
    setError("");
    setBooking(null);

    if (!pnr) {
      setError("Please enter a PNR number.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.get(`/pnr/${pnr}`);
      if (data.success) {
        setBooking(data);
      } else {
        setError("PNR not found. Please check the number and try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pnr-container">
      <div className="pnr-header">
        <h2>Check PNR Status</h2>
        <p className="pnr-description">
          Enter your 10-digit PNR number to get instant updates on your booking status.
        </p>
      </div>

      <form onSubmit={handleCheck} className="pnr-form">
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter 10-digit PNR Number"
            value={pnr}
            onChange={(e) => setPnr(e.target.value)}
            className="pnr-input"
            maxLength="10"
            required
          />
          <button type="submit" disabled={loading} className="check-btn">
            {loading ? (
              <>
                <FaSpinner className="spinner" /> Checking...
              </>
            ) : (
              "Check Status"
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message">
          <FaTimesCircle className="error-icon" /> {error}
        </div>
      )}

      {booking && <BookingCard booking={booking} />}
    </div>
  );
};

export default PNRStatus;