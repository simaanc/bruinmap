const router = require("express").Router();
const Event = require("../models/event.model");

// GET request to fetch all events
router.route("/").get((req, res) => {
	Event.find()
		.then((events) => res.json(events))
		.catch((err) => res.status(400).json("Error: " + err));
});

// POST request to add a new event
router.route("/add").post((req, res) => {
	const { name, time, coords, details } = req.body;

	const newEvent = new Event({
		name,
		time,
		coords,
		details,
	});

	newEvent
		.save()
		.then(() => res.json("Event added!"))
		.catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
