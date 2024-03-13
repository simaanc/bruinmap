const crypto = require('crypto'); // Import the crypto module for generating tokens
const nodemailer = require('nodemailer'); // Assuming you're using nodemailer for sending emails
const express = require("express");
const router = express.Router();
const User = require("../models/User.model");

// Assuming you have configured nodemailer with your email account
const transporter = nodemailer.createTransport({
  service: 'gmail', // Example with Gmail
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-password',
  },
});

// Reset password route
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a reset token and expiry (optional)
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now

    await user.save();

    // Send the email
    const resetEmail = {
      to: user.email,
      from: 'your-email@gmail.com',
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/reset/${resetToken}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(resetEmail, (err) => {
      if (err) {
        console.error('Error sending password reset email:', err);
        return res.status(500).json({ message: "Error sending password reset email" });
      }
      res.status(200).json({ message: 'An e-mail has been sent with further instructions.' });
    });

  } catch (err) {
    console.error('Error on reset-password route:', err);
    res.status(500).json({ message: err.message });
  }
});
