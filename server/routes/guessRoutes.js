const express = require("express");
const Player = require("../models/Player");
const DailyPuzzle = require("../models/DailyPuzzle");
const router = express.Router();

const getToday = () => {
  return new Date().toISOString().split("T")[0];
};

const getYesterday = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().split("T")[0];
};

router.post("/", async (req, res) => {
  try {
    const { username, guess } = req.body;

    // Validate input
    if (!username || guess === undefined) {
      return res.status(400).json({
        message: "Username and guess are required",
      });
    }

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      return res.status(400).json({
        message: "Username cannot be empty",
      });
    }

    const numericGuess = Number(guess);

    if (
      !Number.isInteger(numericGuess) ||
      numericGuess < 1 ||
      numericGuess > 10
    ) {
      return res.status(400).json({
        message: "Guess must be a number between 1 and 10",
      });
    }

    const today = getToday();
    const yesterday = getYesterday();

    // Get today's puzzle
    const puzzle = await DailyPuzzle.findOne({ date: today });

    if (!puzzle) {
      return res.status(404).json({
        message: "Today's puzzle is not available yet",
      });
    }

    // Find or create player
    let player = await Player.findOne({
      username: trimmedUsername,
    });

    if (!player) {
      player = await Player.create({
        username: trimmedUsername,
        firstPlayedDate: today,
      });
    } else if (!player.firstPlayedDate) {
      // Backfill old players
      player.firstPlayedDate = player.lastPlayedDate || today;
    }

    // Only one guess per day
    if (player.lastPlayedDate === today) {
      return res.status(400).json({
        message: "You have already used your guess for today!",
        streak: player.streak,
        lastResult: player.lastResult,
      });
    }

    // Reset streak if player missed yesterday
    if (player.lastPlayedDate && player.lastPlayedDate !== yesterday) {
      player.streak = 0;
    }

    const isCorrect = numericGuess === puzzle.answer;

    // Update player
    player.lastPlayedDate = today;

    if (isCorrect) {
      player.streak += 1;
      player.lastResult = "correct";
    } else {
      player.streak = 0;
      player.lastResult = "wrong";
    }

    await player.save();

    res.json({
      correct: isCorrect,
      answer: puzzle.answer,
      streak: player.streak,
      message: isCorrect
        ? "Correct! Your streak increased."
        : "Wrong! Your streak has been reset.",
    });
  } catch (error) {
    console.error("Guess error:", error);
    res.status(500).json({
      message: "Failed to process guess",
    });
  }
});

module.exports = router;
