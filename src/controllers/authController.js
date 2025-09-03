const OTP = require("../models/otpModel");
const { sendOtpService } = require("../services/sendOtpService");

const sendOtp = async (req, res, next) => {
  try {
    const { emailId } = req.body;
    const resData = await sendOtpService(emailId);
    res.status(201).json(resData);
  } catch (err) {
    next(err);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { emailId, otp } = req.body;
    const otpRecord = await OTP.findOne({ emailId, otp });

    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or Expired OTP!" });
    }

    // Delete OTP after success ✅
    await OTP.deleteOne({ emailId });

    return res.json({ message: "OTP Verified!" });
  } catch (err) {
    next(err);
  }
};


module.exports = { sendOtp, verifyOtp };
