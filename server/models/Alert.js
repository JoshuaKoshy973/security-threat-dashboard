const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
      index: true
    },
    threatScore: {
      type: Number,
      default: 0,
      index: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    relatedIp: {
      type: String,
      trim: true,
      index: true
    },
    resolved: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  { timestamps: true }
);

// Indexes support faster alert filtering, prioritization, and dashboard analytics
alertSchema.index({ createdAt: -1 });
alertSchema.index({ severity: 1, resolved: 1 });
alertSchema.index({ relatedIp: 1, threatScore: -1 });

module.exports = mongoose.model("Alert", alertSchema);