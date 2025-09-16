import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify'; // 👈 Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // 👈 Import toast styles

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SearchTrains from "./pages/SearchTrains";
import BookTrain from "./pages/BookTrain";
import MyBookings from "./pages/MyBookings";
import PNRStatus from "./pages/PNRStatus";
import Profile from "./pages/Profile";

// Components
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="app-container" style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchTrains />} />
          <Route path="/book/:trainId" element={<BookTrain />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/pnr" element={<PNRStatus />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
      <ToastContainer /> {/* 👈 Add the ToastContainer component here */}
    </Router>
  );
}

export default App;