const Admin = require("../models/admin");
const Faculty = require("../models/faculty");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

exports.forgotPassword = async (req, res) => {
  const { email, role } = req.body;
  const Model = role === "admin" ? Admin : Faculty;

  const user = await Model.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  // const otp = otpGenerator.generate(6, {
  //   upperCase: false,
  //   specialChars: false,
  // });
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.resetOTP = otp;
  user.resetOTPExpiry = Date.now() + 10 * 60 * 1000;
  user.resetOTPAttempts = 0;
  await user.save();

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // SSL
    auth: {
      user: process.env.EMAIL_USER,
      // user: "shahbazshaikh485@gmail.com",
      pass: process.env.EMAIL_PASS,
    },
  });

  //  const info = await transporter.sendMail({
  //    from: "shahbazshaikh485@gmail.com",
  //    to: email,
  //    subject: "Reset Password Link",
  //    html: `<p>Click to reset password: <a href="${resetLink}">Reset Password</a></p>`,
  //  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Password Reset OTP",
    html: `<h2>Your OTP is ${otp}</h2><p>Valid for 10 minutes.</p>`,
  });

  res.json({ message: "OTP sent to email" });
};

exports.resetPassword = async (req, res) => {
  const { email, role, otp, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword)
    return res.status(400).json({ message: "Passwords do not match" });

  const Model = role === "admin" ? Admin : Faculty;
  const user = await Model.findOne({ email });

  if (!user || !user.resetOTP)
    return res.status(400).json({ message: "OTP not requested" });

  if (user.resetOTPAttempts >= 5)
    return res.status(403).json({ message: "Too many attempts. Try later." });

  if (Date.now() > user.resetOTPExpiry)
    return res.status(400).json({ message: "OTP expired" });

  if (user.resetOTP !== otp) {
    user.resetOTPAttempts++;
    await user.save();
    return res.status(400).json({ message: "Invalid OTP" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetOTP = null;
  user.resetOTPExpiry = null;
  user.resetOTPAttempts = 0;
  await user.save();

  res.json({ message: "Password reset successful" });
};
