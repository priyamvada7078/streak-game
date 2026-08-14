const express = require("express");
const Player = require("../models/Player");

const router = express.Router();

router.get("/:username", async (req, res) => {
  try {
    const player = await Player.findOne({
      username: req.params.username.trim(),
    });

    if (!player) {
      return res.status(404).json({
        message: "Player not found",
      });
    }

    res.json({
      username: player.username,
      streak: player.streak,
      lastPlayedDate: player.lastPlayedDate,
      lastResult: player.lastResult,
      firstPlayedDate: player.firstPlayedDate, // NEW
    });
  } catch {
    res.status(500).json({
      message: "Failed to get player data",
    });
  }
});

module.exports = router;
