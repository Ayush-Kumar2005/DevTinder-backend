const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  emailId: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // 10 minutes
  },
});

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;
