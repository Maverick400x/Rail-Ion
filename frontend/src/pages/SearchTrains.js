import React, { useState, useEffect } from "react";
import API from "../api/api";
import TrainCard from "../components/TrainCard";
import { FaExchangeAlt, FaSearch, FaCalendarAlt, FaSpinner } from "react-icons/fa";
import "../styles/SearchTrains.css";

const SearchTrains = () => {
  const [stations, setStations] = useState([]);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [date, setDate] = useState("");
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await API.get("/trains/stations/all");
        setStations(response.data.stations || []);
      } catch (err) {
        console.error("Error fetching stations:", err);
      }
    };
    fetchStations();
  }, []);

  useEffect(() => {
    const fetchDestinations = async () => {
      if (!source) return setDestinations([]);
      setDestination("");
      try {
        const response = await API.get("/trains/stations/destinations", {
          params: { source: source.trim() },
        });
        setDestinations(response.data.destinations || []);
      } catch (err) {
        console.error("Error fetching destinations:", err);
        setDestinations([]);
      }
    };
    fetchDestinations();
  }, [source]);

  const handleReverse = () => {
    setSource(destination);
    setDestination(source);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setTrains([]);

    if (!source.trim() || !destination.trim() || !date) {
      setError("Please fill all required fields (From, To, Date).");
      return;
    }
    if (date < today) {
      setError("Travel date cannot be in the past.");
      return;
    }

    setLoading(true);
    try {
      const response = await API.get("/trains/search", {
        params: { source: source.trim(), destination: destination.trim(), date },
      });

      const fetchedTrains = response.data.trains || [];
      setTrains(fetchedTrains);

      if (fetchedTrains.length === 0) {
        setError("No trains found for this route.");
      }
    } catch (err) {
      console.error("Error fetching trains:", err);
      setError("Failed to search for trains. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-trains-container">
      <h2 className="main-title">Find and Book Train Tickets</h2>
      <div className="search-form-card">
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-group-station">
            <div className="input-group">
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                required
              >
                <option value="">From Station</option>
                {stations.map((station, index) => (
                  <option key={index} value={station}>
                    {station}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleReverse}
              className="reverse-btn"
              title="Swap From & To"
              disabled={loading}
            >
              <FaExchangeAlt />
            </button>
            <div className="input-group">
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
                disabled={!source}
              >
                <option value="">To Station</option>
                {destinations.map((dest, index) => (
                  <option key={index} value={dest}>
                    {dest}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group-date">
            <div className="input-group">
              <FaCalendarAlt className="input-icon" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={today}
                required
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="search-btn">
            {loading ? (
              <>
                <FaSpinner className="spinner" /> Searching...
              </>
            ) : (
              <>
                <FaSearch /> Search
              </>
            )}
          </button>
        </form>
      </div>

      {error && <p className="error-message">{error}</p>}

      {trains.length > 0 && (
        <div className="train-results-container">
          <h3 className="results-heading">Available Trains ({trains.length})</h3>
          {trains.map((train) => (
            <TrainCard key={train._id} train={train} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchTrains;