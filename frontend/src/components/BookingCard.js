import React from "react";
import {
  FaTrain,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaRupeeSign,
  FaUser,
  FaInfoCircle,
  FaExclamationTriangle
} from "react-icons/fa";
import "../styles/BookingCard.css";

const BookingCard = ({ booking }) => {
  if (!booking || !booking.pnr) {
    return <div className="booking-card empty-card">No booking data available.</div>;
  }

  const { pnr, totalFare, status, travelDate } = booking;
  const train = booking.train || {};
  const { trainName, trainNumber, source, destination, departureTime, arrivalTime } = train;

  const passengers =
    booking.passengers && booking.passengers.length > 0
      ? booking.passengers
      : (booking.passengerDetails?.map(detail => ({ name: detail })) || []);

  const isDepartingSoon = () => {
    if (!travelDate || !departureTime) return false;

    const [hours, minutes] = departureTime.split(":").map(Number);
    const departureDateTime = new Date(travelDate);
    departureDateTime.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const diffHours = (departureDateTime - now) / (1000 * 60 * 60);

    return diffHours > 0 && diffHours <= 6;
  };

  const departingSoon = isDepartingSoon();

  const getStatusClass = (currentStatus) => {
    switch (currentStatus?.toLowerCase()) {
      case "confirmed":
        return "status-confirmed";
      case "pending":
        return "status-pending";
      case "cancelled":
        return "status-cancelled";
      default:
        return "status-unknown";
    }
  };

  return (
    <div className={`booking-card ${departingSoon ? "departing-soon" : ""}`}>
      {departingSoon && (
        <div className="alert-badge">
          <FaExclamationTriangle className="alert-icon" />
          <span className="alert-text">Departing Soon</span>
        </div>
      )}

      <div className="card-header">
        <h3 className="pnr">PNR: {pnr ?? "N/A"}</h3>
        <span className={`booking-status ${getStatusClass(status)}`}>
          {status ?? "N/A"}
        </span>
      </div>

      <div className="card-body">
        <div className="info-section train-details">
          <div className="info-item">
            <FaTrain className="info-icon" />
            <span>
              <strong>{trainName ?? "N/A"}</strong> ({trainNumber ?? "N/A"})
            </span>
          </div>
          <div className="info-item">
            <FaMapMarkerAlt className="info-icon" />
            <span>
              <strong className="city">{source ?? "N/A"}</strong>
              <span className="arrow"> → </span>
              <strong className="city">{destination ?? "N/A"}</strong>
            </span>
          </div>
          <div className="info-item">
            <FaCalendarAlt className="info-icon" />
            <span>
              {travelDate ? new Date(travelDate).toLocaleDateString() : "N/A"}
            </span>
          </div>
          <div className="info-item">
            <FaClock className="info-icon" />
            <span>
              <strong>Departure:</strong> {departureTime ?? "N/A"} | <strong>Arrival:</strong> {arrivalTime ?? "N/A"}
            </span>
          </div>
        </div>

        <div className="info-section passenger-details">
          <h4><FaUser className="section-icon" /> Passengers</h4>
          <ul className="passenger-list">
            {passengers.length > 0 ? (
              passengers.map((p, index) => (
                <li key={index} className="passenger-item">
                  <FaInfoCircle className="item-icon" />
                  <span className="passenger-info">
                    <strong>{p?.name ?? "Unknown"}</strong>
                    {p.seatNo && <span className="seat-no"> (Seat: {p.seatNo})</span>}
                    {p.classType && <span className="class-type"> ({p.classType})</span>}
                  </span>
                </li>
              ))
            ) : (
              <li className="no-data">No passengers added.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="card-footer">
        <FaRupeeSign className="footer-icon" />
        <strong>Total Fare:</strong> ₹{totalFare ?? 0}
      </div>
    </div>
  );
};

export default BookingCard;