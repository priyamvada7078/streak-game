const express = require("express");
const DailyPuzzle = require("../models/DailyPuzzle");

const router = express.Router();

// Get today's date in YYYY-MM-DD format
const getToday = () => {
  return new Date().toISOString().split("T")[0];
};

// GET today's puzzle
router.get("/", async (req, res) => {
  try {
    const today = getToday();

    let puzzle = await DailyPuzzle.findOne({ date: today });

    // Create a puzzle if one doesn't exist for today
    if (!puzzle) {
      const answer = Math.floor(Math.random() * 10) + 1;

      puzzle = await DailyPuzzle.create({
        date: today,
        answer,
      });
    }

    // Never send the answer to the frontend
    res.json({
      date: puzzle.date,
      range: {
        min: 1,
        max: 10,
      },
      message: "Guess today's secret number!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get today's puzzle",
    });
  }
});

module.exports = router;