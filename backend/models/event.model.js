const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
	name: { type: String, required: true },
	time: { type: Date, required: true },
	coords: { type: [Number], required: true },
	details: { type: String, required: true },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
