// routes/pnr.js
const express = require("express");
const router = express.Router();
const pnrController = require("../controllers/pnrController");

// @route   GET /api/pnr/:pnr
// @desc    Check PNR status
// @access  Public
router.get("/:pnr", pnrController.checkPNRStatus);

module.exports = router;