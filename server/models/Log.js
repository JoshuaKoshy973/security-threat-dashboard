const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    ipAddress: {
      type: String,
      required: true
    },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low"
    },
    description: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Log", logSchema);