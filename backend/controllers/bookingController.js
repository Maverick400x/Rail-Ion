// controllers/bookingController.js
const Booking = require("../models/Booking");
const Train = require("../models/Train");
const Passenger = require("../models/Passenger");
const generatePNR = require("../utils/generatePNR");

// Utility to get coach name based on classType
const getCoachPrefix = (classType) => {
  switch (classType) {
    case "AC1":
      return "A1";
    case "AC2":
      return "A2";
    case "AC3":
      return "A3";
    case "Sleeper":
      return "S";
    default:
      return "X";
  }
};

// ============================
// Book tickets with seat allocation
// ============================
exports.bookTickets = async (req, res) => {
  try {
    const { trainId, passengers, travelDate } = req.body;

    if (!trainId || !passengers || !travelDate || passengers.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "All booking details are required" });
    }

    const train = await Train.findById(trainId);
    if (!train)
      return res
        .status(404)
        .json({ success: false, message: "Train not found" });

    // Validate passenger classType
    for (const p of passengers) {
      if (!p.classType || !train.seatCapacity[p.classType]) {
        return res.status(400).json({
          success: false,
          message: `Invalid class type for passenger ${p.name}`,
        });
      }
    }

    // Count passengers per class
    const classCounts = {};
    passengers.forEach(
      (p) => (classCounts[p.classType] = (classCounts[p.classType] || 0) + 1)
    );

    // Check seat availability
    for (const cls in classCounts) {
      if (train.seatCapacity[cls] < classCounts[cls]) {
        return res
          .status(400)
          .json({ success: false, message: `Not enough seats in ${cls}` });
      }
    }

    // Fetch existing bookings for this train & date
    const existingBookings = await Booking.find({ train: trainId, travelDate })
      .populate("passengers")
      .lean();

    // Initialize seat counters per class
    const seatCounter = { AC1: 0, AC2: 0, AC3: 0, Sleeper: 0 };
    existingBookings.forEach((booking) => {
      booking.passengers.forEach((p) => {
        if (p.classType && p.seatNo) {
          const seatNum = parseInt(p.seatNo.split("-")[1], 10);
          if (seatNum > (seatCounter[p.classType] || 0))
            seatCounter[p.classType] = seatNum;
        }
      });
    });

    // Assign seat numbers with coach prefix
    const passengersWithSeats = passengers.map((p) => {
      seatCounter[p.classType] += 1;
      const coach = getCoachPrefix(p.classType);
      return { ...p, seatNo: `${coach}-${seatCounter[p.classType]}` };
    });

    // Save passengers
    const passengerDocs = await Passenger.insertMany(passengersWithSeats);

    // Calculate total fare
    const totalFare = passengerDocs.reduce(
      (sum, p) => sum + (train.fare[p.classType] || 0),
      0
    );

    // Generate unique PNR
    let pnr;
    do {
      pnr = generatePNR();
    } while (await Booking.findOne({ pnr }));

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      train: train._id,
      passengers: passengerDocs.map((p) => p._id),
      pnr,
      totalFare,
      travelDate,
      status: "CONFIRMED",
    });

    // Reduce seats in train
    for (const cls in classCounts) {
      train.seatCapacity[cls] -= classCounts[cls];
    }
    await train.save();

    // Populate before sending response
    await booking.populate({
      path: "passengers train user",
      select:
        "name age gender classType seatNo trainName trainNumber source destination",
    });

    res.status(201).json({ success: true, booking, pnr });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// Cancel booking with refund logic
// ============================
exports.cancelBooking = async (req, res) => {
  try {
    const { pnr } = req.params;

    const booking = await Booking.findOne({ pnr }).populate("train passengers");
    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Calculate refund
    const train = booking.train;
    const now = new Date();
    const departure = new Date(`${booking.travelDate}T${train.departureTime}`);
    let refundAmount = 0;

    if (booking.status === "Cancelled") {
      return res.status(400).json({ success: false, message: "Booking already cancelled" });
    }

    if (booking.status === "Train Cancelled") {
      refundAmount = booking.totalFare; // 100% refund
    } else if (now < departure) {
      refundAmount = booking.totalFare * 0.5; // 50% refund
    } else {
      return res.status(400).json({ success: false, message: "Cannot cancel after departure" });
    }

    // Refund seats
    const classCounts = {};
    booking.passengers.forEach(
      (p) => (classCounts[p.classType] = (classCounts[p.classType] || 0) + 1)
    );
    for (const cls in classCounts) {
      train.seatCapacity[cls] += classCounts[cls];
    }
    await train.save();

    // Update booking
    booking.status = "Cancelled";
    booking.refundAmount = refundAmount;
    await booking.save();

    res.json({
      success: true,
      message: `Booking cancelled successfully. Refund: ₹${refundAmount}`,
      refundAmount,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// Get booking history for logged-in user
// ============================
exports.getBookingHistory = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: "passengers",
        select: "name age gender classType seatNo",
      })
      .populate({
        path: "train",
        select: "trainName trainNumber source destination fare departureTime arrivalTime",
      })
      .sort({ bookingDate: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Get booking history error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// Get PNR status
// ============================
exports.getPNRStatus = async (req, res) => {
  try {
    const { pnr } = req.params;

    const booking = await Booking.findOne({ pnr })
      .populate({
        path: "passengers",
        select: "name age gender classType seatNo",
      })
      .populate({
        path: "train",
        select: "trainName trainNumber source destination fare departureTime arrivalTime",
      })
      .populate({
        path: "user",
        select: "name",
      });

    if (!booking)
      return res.status(404).json({ success: false, message: "PNR not found" });

    res.json({
      success: true,
      booking,
      seatNumbers: booking.passengers.map((p) => p.seatNo),
    });
  } catch (error) {
    console.error("Get PNR status error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};