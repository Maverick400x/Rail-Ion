// models/Train.js
const mongoose = require("mongoose");

const trainSchema = new mongoose.Schema({
    trainNumber: { type: String, required: true, unique: true },
    trainName: { type: String, required: true },
    source: { type: String, required: true },
    destination: { type: String, required: true },
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    seatCapacity: {
        AC1: { type: Number, default: 10 },
        AC2: { type: Number, default: 20 },
        AC3: { type: Number, default: 30 },
        Sleeper: { type: Number, default: 50 }
    },
    fare: {
        AC1: { type: Number, default: 1500 },
        AC2: { type: Number, default: 1200 },
        AC3: { type: Number, default: 900 },
        Sleeper: { type: Number, default: 500 }
    }
}, { timestamps: true });

module.exports = mongoose.model("Train", trainSchema);