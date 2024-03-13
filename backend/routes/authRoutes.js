const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Signup route
router.post("/signup", async (req, res) => {
	try {
		const { email, password } = req.body;
		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new User({ email, password: hashedPassword });
		await newUser.save();

		const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);
		res.status(201).json({ user: newUser, token });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Signin route
router.post("/signin", async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
		res.status(200).json({ user, token });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

router.get("/events", async (req, res) => {
	try {
		console.log("Fetching user events...");
		const token = req.headers.authorization.split(" ")[1];
		console.log("Token:", token);
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		console.log("Decoded token:", decodedToken);
		const userId = decodedToken.userId;
		console.log("User ID:", userId);

		// Find the user by their ID and populate the events field
		const user = await User.findById(userId).populate("events");
		console.log("User:", user);

		if (!user) {
			console.log("User not found");
			return res.status(404).json({ message: "User not found" });
		}

		// Return the user's events
		console.log("User events:", user.events);
		res.status(200).json({ events: user.events });
	} catch (err) {
		console.error("Error fetching user events:", err);
		res.status(500).json({ message: err.message });
	}
});

// Get current user route
router.get("/me", async (req, res) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decodedToken.userId);
		res.status(200).json({ user });
	} catch (err) {
		res.status(401).json({ message: "Unauthorized" });
	}
});

router.post("/save-event", async (req, res) => {
	try {
		const { eventId } = req.body;
		const token = req.headers.authorization.split(" ")[1];
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		const userId = decodedToken.userId;

		// Find the user by their ID and update their events array
		const user = await User.findByIdAndUpdate(
			userId,
			{ $addToSet: { events: eventId } },
			{ new: true }
		).populate("events");

		res.status(200).json({ user });
	} catch (err) {
		console.error("Error saving event:", err);
		res.status(500).json({ message: err.message });
	}
});

// Signout route
router.post("/signout", (req, res) => {
	// Since we are using JWT, there's no need to do anything on the server side for signout
	res.status(200).json({ message: "Signout successful" });
});

module.exports = router;
