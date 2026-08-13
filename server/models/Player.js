const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastPlayedDate: {
      type: String,
      default: null,
    },
    lastResult: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Player", playerSchema);