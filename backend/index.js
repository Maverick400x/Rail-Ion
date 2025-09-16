// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Route imports
const authRoutes = require("./routes/auth");
const trainRoutes = require("./routes/trains");
const bookingRoutes = require("./routes/booking");
const pnrRoutes = require("./routes/pnr");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(cors({ origin: "*" })); // 🔓 allow all origins for dev, restrict in prod
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Handle form data

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/trains", trainRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/pnr", pnrRoutes);

// Default route
app.get("/", (req, res) => {
    res.send("🚆 Rail-Ion Booking Backend Server is running!");
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("🔥 Error:", err.stack);
    res.status(500).json({ success: false, message: "Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🥳 Server running on port ${PORT}`);
});