const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      trim: true
    },
    ipAddress: {
      type: String,
      required: true,
      trim: true
    },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
      index: true
    },
    threatScore: {
      type: Number,
      default: 0,
      index: true
    },
    description: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

// Indexes improve query performance for common dashboard and security searches
logSchema.index({ ipAddress: 1 });
logSchema.index({ eventType: 1 });
logSchema.index({ createdAt: -1 });
logSchema.index({ ipAddress: 1, threatScore: -1 });

module.exports = mongoose.model("Log", logSchema);