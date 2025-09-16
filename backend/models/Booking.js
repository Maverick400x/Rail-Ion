// models/Booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    train: { type: mongoose.Schema.Types.ObjectId, ref: "Train", required: true },
    passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Passenger", required: true }],
    pnr: { type: String, required: true, unique: true },
    travelDate: { type: Date, required: true },
    totalFare: { type: Number, required: true },
    status: { type: String, enum: ["CONFIRMED", "CANCELLED"], default: "CONFIRMED" },
    bookingDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual to get all passenger seat numbers
bookingSchema.virtual("seatNumbers").get(function () {
  if (this.populated("passengers") && Array.isArray(this.passengers)) {
    return this.passengers.map((p) => p.seatNo || "N/A");
  }
  return [];
});

// Virtual to get passenger names
bookingSchema.virtual("passengerNames").get(function () {
  if (this.populated("passengers") && Array.isArray(this.passengers)) {
    return this.passengers.map((p) => p.name || "Unknown");
  }
  return [];
});

// Virtual to get passenger details formatted
bookingSchema.virtual("passengerDetails").get(function () {
  if (this.populated("passengers") && Array.isArray(this.passengers)) {
    return this.passengers.map(
      (p) => `${p.name} (${p.age} yrs, ${p.gender}, ${p.classType}) - Seat: ${p.seatNo || "N/A"}`
    );
  }
  return [];
});

module.exports = mongoose.model("Booking", bookingSchema);