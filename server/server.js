const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const puzzleRoutes = require("./routes/puzzleRoutes");
const guessRoutes = require("./routes/guessRoutes");
const playerRoutes = require("./routes/playerRoutes");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/puzzle", puzzleRoutes);
app.use("/api/guess", guessRoutes);
app.use("/api/player", playerRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Streak API is running!" });
});

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});