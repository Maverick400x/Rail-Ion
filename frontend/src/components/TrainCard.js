import React from "react";
import { Link } from "react-router-dom";
import { FaTrain, FaClock, FaTicketAlt, FaBolt } from "react-icons/fa"; // Removed FaInfoCircle
import "../styles/TrainCard.css";

const TrainCard = ({ train }) => {
  if (!train || !train.trainName) {
    return null;
  }

  const totalAvailableSeats = Object.values(train.seatCapacity || {}).reduce(
    (sum, seats) => sum + (seats > 0 ? seats : 0),
    0
  );

  const isFastFilling = totalAvailableSeats > 0 && totalAvailableSeats <= 20;

  const renderClassInfo = (classType) => {
    const seats = train.seatCapacity?.[classType] || 0;
    const fare = train.fare?.[classType] || 0;
    const isAvailable = seats > 0;

    return (
      <div className="class-item" key={classType}>
        <span className="class-name">{classType}</span>
        <span className="fare">₹{fare}</span>
        <span className={`status-tag ${isAvailable ? "available" : "waitlist"}`}>
          {isAvailable ? `${seats} Seats` : "Waitlist"}
        </span>
      </div>
    );
  };

  return (
    <div className="train-card">
      <div className="card-header">
        <h3 className="train-title">
          <FaTrain className="train-icon" /> {train.trainName}
          <span className="train-number">({train.trainNumber})</span>
        </h3>
        {isFastFilling && (
          <div className="fast-filling">
            <FaBolt className="fast-filling-icon" /> Fast Filling
          </div>
        )}
      </div>

      <div className="card-body">
        <div className="route-info">
          <p>
            <span className="station-name">{train.source}</span>
            <span className="arrow-icon"> → </span>
            <span className="station-name">{train.destination}</span>
          </p>
          <p className="time-info">
            <FaClock className="time-icon" />
            <span>Departure: {train.departureTime}</span> |
            <span>Arrival: {train.arrivalTime}</span>
          </p>
        </div>

        <div className="class-info">
          <h4><FaTicketAlt className="class-icon-title" /> Classes & Fare</h4>
          <div className="class-grid">
            {renderClassInfo("AC1")}
            {renderClassInfo("AC2")}
            {renderClassInfo("AC3")}
            {renderClassInfo("Sleeper")}
          </div>
        </div>
      </div>

      <div className="card-footer">
        <Link to={`/book/${train._id}`} className="btn book-btn">
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default TrainCard;
