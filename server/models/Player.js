const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  streak: { type: Number, default: 0 },
  lastPlayedDate: { type: String, default: null },
  lastResult: { type: String, default: null },
  firstPlayedDate: { type: String, default: null }, // NEW — set once, never updated
});

module.exports = mongoose.model("Player", playerSchema);