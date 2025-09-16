const Train = require("../models/Train");

// @desc    Add a new train (Optional: for initial setup)
// @route   POST /api/trains
// @access  Public (or admin later)
exports.addTrain = async (req, res) => {
  try {
    const { trainNumber, trainName, source, destination, departureTime, arrivalTime, seatCapacity, fare } = req.body;

    const existingTrain = await Train.findOne({ trainNumber });
    if (existingTrain) {
      return res.status(400).json({ success: false, message: "Train already exists" });
    }

    const train = await Train.create({
      trainNumber,
      trainName,
      source,
      destination,
      departureTime,
      arrivalTime,
      seatCapacity,
      fare,
    });

    res.status(201).json({ success: true, train });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all trains
// @route   GET /api/trains
// @access  Public
exports.getAllTrains = async (req, res) => {
  try {
    const trains = await Train.find();
    res.json({ success: true, trains });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Search trains by source and destination
// @route   GET /api/trains/search
// @access  Public
exports.searchTrains = async (req, res) => {
  try {
    const { source, destination } = req.query;

    if (!source || !destination) {
      return res.status(400).json({ success: false, message: "Source and destination are required" });
    }

    const trains = await Train.find({
      source: { $regex: new RegExp(source, "i") },
      destination: { $regex: new RegExp(destination, "i") },
    });

    res.json({ success: true, trains });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get train details by ID
// @route   GET /api/trains/:id
// @access  Public
exports.getTrainById = async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);
    if (!train) return res.status(404).json({ success: false, message: "Train not found" });
    res.json({ success: true, train });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// Get all unique stations
// ============================
// @desc    Get all unique stations (source and destination) for dropdowns
// @route   GET /api/stations
// @access  Public
exports.getStations = async (req, res) => {
  try {
    const sources = await Train.distinct("source");
    const destinations = await Train.distinct("destination");

    const stations = Array.from(new Set([...sources, ...destinations]));

    res.json({ success: true, stations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// Get destinations based on selected source
// ============================
// @desc    Get destinations from a given source
// @route   GET /api/trains/destinations?source=XYZ
// @access  Public
exports.getDestinationsBySource = async (req, res) => {
  try {
    const { source } = req.query;
    if (!source) return res.status(400).json({ success: false, message: "Source is required" });

    const destinations = await Train.distinct("destination", { source });

    res.json({ success: true, destinations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};