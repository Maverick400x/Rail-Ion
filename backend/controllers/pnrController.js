// controllers/pnrController.js
const Booking = require("../models/Booking");

// @desc    Check PNR status
// @route   GET /api/pnr/:pnr
// @access  Public
exports.checkPNRStatus = async (req, res) => {
  try {
    const { pnr } = req.params;

    const booking = await Booking.findOne({ pnr })
      .populate("train passengers user");

    if (!booking) {
      return res.status(404).json({ success: false, message: "PNR not found" });
    }

    res.json({
      success: true,
      pnr: booking.pnr,
      status: booking.status,
      travelDate: booking.travelDate,
      train: {
        trainNumber: booking.train.trainNumber,
        trainName: booking.train.trainName,
        source: booking.train.source,
        destination: booking.train.destination,
        departureTime: booking.train.departureTime,
        arrivalTime: booking.train.arrivalTime,
      },
      passengers: booking.passengers.map((p) => ({
        name: p.name,
        age: p.age,
        gender: p.gender,
        seatNumber: p.seatNumber,
        classType: p.classType,
      })),
      bookedBy: booking.user.name,
      totalFare: booking.totalFare,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message });
  }
};