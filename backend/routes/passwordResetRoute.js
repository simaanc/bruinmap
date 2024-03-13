const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const API_BASE_URL = process.env.REACT_APP_FRONTEND_BASE_URL;

// Assuming you have configured nodemailer with your email account
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bruinmap35L@gmail.com",
    pass: "zrwf sjel lxrf sshi",
  },
});

// Route handler for initiating the password reset
router.post("/reset-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a reset token and expiry
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
    await user.save();

    // Send the email
    const resetEmail = {
      to: user.email,
      from: 'bruinmap35L@gmail.com',
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${API_BASE_URL}/reset/${resetToken}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(resetEmail, (err) => {
      if (err) {
        console.error("Error sending password reset email:", err);
        return res.status(500).json({ message: "Error sending password reset email" });
      }
      res.status(200).json({ message: "An e-mail has been sent with further instructions." });
    });
  } catch (err) {
    console.error("Error on reset-password route:", err);
    res.status(500).json({ message: err.message });
  }
});

// Route handler for resetting the password
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find the user by the reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;