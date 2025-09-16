import React, { useState } from "react";
import { FaUserPlus, FaTimes, FaUser, FaBirthdayCake, FaTransgender, FaChair } from "react-icons/fa";
import "../styles/PassengerForm.css";

const PassengerForm = ({ passengers, setPassengers }) => {
  const [passenger, setPassenger] = useState({ name: "", age: "", gender: "Male", classType: "Sleeper" });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!passenger.name || !passenger.age) {
      alert("Name and Age are required");
      return;
    }

    setPassengers([...passengers, passenger]);
    setPassenger({ name: "", age: "", gender: "Male", classType: "Sleeper" });
  };

  const handleRemove = (index) => {
    const newPassengers = passengers.filter((_, i) => i !== index);
    setPassengers(newPassengers);
  };

  return (
    <div className="passenger-form-container">
      <div className="form-card">
        <h3 className="form-title">
          <FaUserPlus className="form-icon" /> Add Passengers
        </h3>
        <form onSubmit={handleAdd} className="add-form">
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Full Name"
              value={passenger.name}
              onChange={(e) => setPassenger({ ...passenger, name: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <FaBirthdayCake className="input-icon" />
            <input
              type="number"
              placeholder="Age"
              value={passenger.age}
              onChange={(e) => setPassenger({ ...passenger, age: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <FaTransgender className="input-icon" />
            <select
              value={passenger.gender}
              onChange={(e) => setPassenger({ ...passenger, gender: e.target.value })}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="input-group">
            <FaChair className="input-icon" />
            <select
              value={passenger.classType}
              onChange={(e) => setPassenger({ ...passenger, classType: e.target.value })}
            >
              <option value="AC1">AC1</option>
              <option value="AC2">AC2</option>
              <option value="AC3">AC3</option>
              <option value="Sleeper">Sleeper</option>
            </select>
          </div>
          <button type="submit" className="add-btn">Add Passenger</button>
        </form>
      </div>

      <div className="passengers-list-card">
        <h3 className="list-title">Added Passengers</h3>
        <ul className="passenger-list">
          {passengers.length === 0 ? (
            <li className="no-passengers">No passengers added yet.</li>
          ) : (
            passengers.map((p, index) => (
              <li key={index} className="passenger-item">
                <span className="passenger-details">
                  <FaUser className="user-icon-list" />
                  <strong>{p.name}</strong> ({p.age} yrs, {p.gender}, {p.classType})
                </span>
                <button className="remove-btn" onClick={() => handleRemove(index)}>
                  <FaTimes />
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default PassengerForm;