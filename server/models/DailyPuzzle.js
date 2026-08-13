const mongoose = require("mongoose");

const dailyPuzzleSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      unique: true,
    },
    answer: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DailyPuzzle", dailyPuzzleSchema);