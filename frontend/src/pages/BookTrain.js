import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import PassengerForm from "../components/PassengerForm";
import BookingCard from "../components/BookingCard";
import { FaCalendarAlt, FaTrain, FaSpinner, FaExclamationCircle } from "react-icons/fa";
import { toast } from 'react-toastify'; // Import toast
import "../styles/BookTrain.css";

const BookTrain = () => {
  const { trainId } = useParams();
  const navigate = useNavigate();
  const [train, setTrain] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [travelDate, setTravelDate] = useState("");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isLoggedIn = !!localStorage.getItem("token");
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    const savedDate = localStorage.getItem("travelDate");
    if (savedDate) setTravelDate(savedDate);

    const fetchTrain = async () => {
      try {
        const { data } = await API.get(`/trains/${trainId}`);
        setTrain(data.train);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch train details. Please try again.");
      }
    };
    fetchTrain();
  }, [trainId, navigate, isLoggedIn]);

  const handleBooking = async () => {
    setError("");

    if (!travelDate || passengers.length === 0) {
      setError("Please select a travel date and add at least one passenger.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post("/booking", {
        trainId,
        travelDate,
        passengers,
      });

      setBooking(data.booking);
      // Use toast.success for a professional, temporary notification
      toast.success(`Booking successful! Your PNR is: ${data.booking.pnr}`, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Booking failed. Please try again.");
      // You can also use toast.error for a dedicated error notification
      toast.error(error.response?.data?.message || "Booking failed. Please try again.", {
        position: "bottom-center"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!train || passengers.length === 0) return 0;
    return passengers.reduce((total, p) => {
      const price = train.fare[p.classType] || 0;
      return total + price;
    }, 0);
  };

  if (!train) return <div className="loading-state">Loading train details...</div>;

  return (
    <div className="book-train-container">
      <h2 className="main-title">
        <FaTrain className="title-icon" /> Book Your Journey
      </h2>
      <div className="booking-grid">
        {/* Left Column: Booking Summary */}
        <div className="booking-summary-col">
          <div className="booking-info-card">
            <h3 className="card-title">Train Details</h3>
            <div className="train-info-section">
              <h4 className="train-name">
                {train.trainName} ({train.trainNumber})
              </h4>
              <p className="route">
                <strong>{train.source}</strong> to <strong>{train.destination}</strong>
              </p>
              <div className="travel-details">
                <span className="detail-item">
                  <FaCalendarAlt />
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    min={today}
                    required
                  />
                </span>
                <span className="detail-item">Departure: {train.departureTime}</span>
                <span className="detail-item">Arrival: {train.arrivalTime}</span>
              </div>
            </div>
          </div>

          {passengers.length > 0 && (
            <div className="summary-card">
              <h3 className="card-title">Passengers Summary</h3>
              <ul className="passenger-summary-list">
                {passengers.map((p, index) => (
                  <li key={index} className="summary-item">
                    <span>{p.name} ({p.classType})</span>
                    <span className="fare-detail">₹{train.fare[p.classType] || 0}</span>
                  </li>
                ))}
              </ul>
              <div className="total-fare">
                <strong>Total Fare:</strong>
                <span className="total-price">₹{calculateTotalPrice()}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="alert error-alert">
              <FaExclamationCircle /> {error}
            </div>
          )}
        </div>

        {/* Right Column: Passenger Form */}
        <div className="passenger-form-col">
          <PassengerForm passengers={passengers} setPassengers={setPassengers} />

          <button
            onClick={handleBooking}
            disabled={loading || passengers.length === 0 || !travelDate}
            className="book-btn"
          >
            {loading ? (
              <>
                <FaSpinner className="spinner" /> Processing...
              </>
            ) : (
              "Confirm & Book"
            )}
          </button>
        </div>
      </div>

      {booking && <BookingCard booking={booking} />}
    </div>
  );
};

export default BookTrain;