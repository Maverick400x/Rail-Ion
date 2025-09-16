const express = require("express");
const router = express.Router();
const trainController = require("../controllers/trainController");

// @route   POST /api/trains
// @desc    Add a new train (optional for initial setup)
// @access  Public (can restrict to admin later)
router.post("/", trainController.addTrain);

// @route   GET /api/trains
// @desc    Get all trains
// @access  Public
router.get("/", trainController.getAllTrains);

// @route   GET /api/trains/search?source=&destination=
// @desc    Search trains by source and destination
// @access  Public
router.get("/search", trainController.searchTrains);

// ============================
// New routes for stations
// ============================
// @route   GET /api/stations/all
// @desc    Get all unique stations (source + destination) for dropdowns
// @access  Public
router.get("/stations/all", trainController.getStations);

// @route   GET /api/stations/destinations?source=XYZ
// @desc    Get all destinations available from a given source
// @access  Public
router.get("/stations/destinations", trainController.getDestinationsBySource);

// @route   GET /api/trains/:id
// @desc    Get train details by ID
// @access  Public
router.get("/:id", trainController.getTrainById);

module.exports = router;