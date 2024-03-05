const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  name: { type: String, required: true },
  coords: { type: [[Number]], required: true },
  content: { type: String, required: true },
});

const floorSchema = new Schema({
  name: { type: String, required: true },
  rooms: [roomSchema],
});

const buildingSchema = new Schema({
  name: { type: String, required: true },
  coords: { type: [[Number]], required: true },
  floors: [floorSchema],
});

const Building = mongoose.model("Building", buildingSchema);

module.exports = Building;