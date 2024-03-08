const router = require("express").Router();
const Building = require("../models/building.model");

// GET request to fetch all buildings
router.route("/").get((req, res) => {
  Building.find()
    .then((buildings) => res.json(buildings))
    .catch((err) => res.status(400).json("Error: " + err));
});

// POST request to add a new building
router.route("/add").post((req, res) => {
  const { name, coords, floors } = req.body;

  const newBuilding = new Building({
    name,
    coords,
    floors,
    center,
  });

  newBuilding
    .save()
    .then(() => res.json("Building added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:buildingName/addFloor").post((req, res) => {
  const { buildingName } = req.params;
  const { floorName } = req.body;

  Building.findOne({ name: buildingName })
    .then((building) => {
      if (!building) {
        const { name, coords } = req.body;
        const newBuilding = new Building({
          name: buildingName,
          coords,
          floors: [{ name: floorName, rooms: [] }],
        });
        return newBuilding
          .save()
          .then(() => res.json({ message: "Building and floor added successfully" }))
          .catch((err) => res.status(400).json("Error: " + err));
      }
      const floorExists = building.floors.some(
        (floor) => floor.name === floorName
      );
      if (floorExists) {
        return res.status(400).json({ message: "Floor already exists" });
      }
      building.floors.push({ name: floorName, rooms: [] });
      building
        .save()
        .then(() => res.json({ message: "Floor added successfully" }))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:buildingName/:floorName/addRoom").post((req, res) => {
  const { buildingName, floorName } = req.params;
  const roomData = req.body;

  Building.findOne({ name: buildingName })
    .then((building) => {
      if (!building) {
        return res.status(404).json({ message: "Building not found" });
      }
      const floor = building.floors.find((floor) => floor.name === floorName);
      if (!floor) {
        const { name, coords } = req.body;
        building.floors.push({ name: floorName, coords, rooms: [roomData] });
        return building
          .save()
          .then(() => res.json({ message: "Floor and room added successfully" }))
          .catch((err) => res.status(400).json("Error: " + err));
      }
      floor.rooms.push(roomData);
      building
        .save()
        .then(() => res.json({ message: "Room added successfully" }))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;