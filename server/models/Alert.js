const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true
    },
    threatScore: {
      type: Number,
      default: 0
    },
    message: {
      type: String,
      required: true
    },
    relatedIp: {
      type: String
    },
    resolved: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);