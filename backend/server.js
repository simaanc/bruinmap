require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const buildingsRouter = require("./routes/buildings");
const eventsRouter = require("./routes/events");
const authRouter = require("./routes/authRoutes");
const searchRouter = require("./routes/searchRoutes");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // For parsing application/json
app.use("/buildings", buildingsRouter);
app.use("/events", eventsRouter);
app.use("/api/auth", authRouter);
app.use("/api", searchRouter);

mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
	console.log("MongoDB database connection established successfully");
});

app.get("/", (req, res) => {
	res.send("Hello from Express and MongoDB!");
});

app.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});
