import React, { useEffect, useState } from "react";
import API from "../api/api";
import BookingCard from "../components/BookingCard";
import "../styles/MyBookings.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch bookings for logged-in user
  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      // JWT token should be stored in localStorage
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in to see bookings.");

      // Make API request
      const { data } = await API.get("/booking/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success && data.bookings && data.bookings.length > 0) {
        // Sort bookings by travel date (latest first)
        const sortedBookings = data.bookings.sort(
          (a, b) => new Date(b.travelDate) - new Date(a.travelDate)
        );
        setBookings(sortedBookings);
      } else {
        setError("No bookings found.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <p>Loading your bookings...</p>;

  if (error)
    return (
      <div className="error-container">
        <p className="error">{error}</p>
        <button
          onClick={fetchBookings}
          style={{
            padding: "8px 16px",
            marginTop: "10px",
            borderRadius: "5px",
            backgroundColor: "#004aad",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="my-bookings-container" style={{ maxWidth: "800px", margin: "20px auto" }}>
      <h2>My Bookings</h2>
      {bookings.map((booking) => (
        <BookingCard key={booking.pnr} booking={booking} />
      ))}
    </div>
  );
};

export default MyBookings;