const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const protect = require("../middleware/authMiddleware.js");

// Book tickets
// POST /api/booking
router.post("/", protect, bookingController.bookTickets);

// Get user's booking history
// GET /api/booking/my  ✅ matches frontend
router.get("/my", protect, bookingController.getBookingHistory);

// Check PNR status
// GET /api/booking/pnr/:pnr
router.get("/pnr/:pnr", protect, bookingController.getPNRStatus);

// Cancel booking by PNR
// DELETE /api/booking/:pnr
router.delete("/:pnr", protect, bookingController.cancelBooking);

module.exports = router;