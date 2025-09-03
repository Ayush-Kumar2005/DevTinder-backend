const { Resend } = require("resend");
const OTP = require("../models/otpModel");

const resend = new Resend("re_6oZCrECi_MkCC9dnSAak8VPLZdSY5N155");

async function sendOtpService(emailId) {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  // Upsert OTP (replace if it already exists)
  await OTP.findOneAndUpdate(
    { emailId },
    { otp, createdAt: new Date() },
    { upsert: true }
  );

  const html = `
    <div style="font-family:sans-serif;">
      <h2>Your OTP is: ${otp}</h2>
      <p>This OTP is valid for 10 minutes.</p>
    </div>
  `;

  await resend.emails.send({
    from: "Storage App <otp@procodrr.dev>",
    to: emailId,
    subject: "Storage App OTP",
    html,
  });

  return { success: true, message: `OTP sent successfully on ${emailId}` };
}

module.exports = { sendOtpService };
