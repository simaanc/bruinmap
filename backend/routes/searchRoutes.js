const express = require("express");
const router = express.Router();
const Building = require("../models/building.model");

router.get("/search", async (req, res) => {
	try {
		const { term } = req.query;

		// Search for buildings based on the search term
		const buildings = await Building.find({
			name: { $regex: term, $options: "i" },
		}).limit(5);

		const escapeRegex = (str) => str.replace(/([()\\])/g, '\\$1');
		
		// Search for rooms based on the search term
		const rooms = await Building.aggregate([
			{ $unwind: "$floors" },
			{ $unwind: "$floors.rooms" },
			{
			  $match: {
				"floors.rooms.name": {
				  $regex: new RegExp(`^${escapeRegex(term.split(" ")[0])}.*`, "i"),
				},
			  },
			},
			{
			  $project: {
				_id: "$floors.rooms._id",
				name: "$floors.rooms.name",
				building: "$name",
				floor: "$floors.name",
			  },
			},
			{ $limit: 5 },
		  ]);

		// Combine the search results
		const suggestions = [
			...buildings.map((building) => ({
				id: building._id,
				name: building.name,
				type: "building",
			})),
			...rooms.map((room) => ({
				id: room._id,
				name: `${room.name} (${room.building})`,
				building: room.building,
				floor: room.floor,
				type: "room",
			})),
		];

		res.json(suggestions);
	} catch (error) {
		console.error("Error fetching search suggestions:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

module.exports = router;
