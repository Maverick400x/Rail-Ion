// models/Passenger.js
const mongoose = require("mongoose");

const passengerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    seatNumber: { type: String }, // assigned during booking
    classType: { type: String, required: true }, // AC1, AC2, AC3, Sleeper
}, { timestamps: true });

module.exports = mongoose.model("Passenger", passengerSchema);