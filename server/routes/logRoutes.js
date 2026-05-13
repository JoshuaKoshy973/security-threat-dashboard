const express = require("express");
const Log = require("../models/Log");
const Alert = require("../models/Alert");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all logs
router.get("/", protect, async (req, res) => {
  try {
    const logs = await Log.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Server error getting logs" });
  }
});

// Create a new log
router.post("/", protect, async (req, res) => {
  try {
    const { eventType, username, ipAddress, description } = req.body;

    let severity = "Low";

    if (eventType === "Failed Login") {
      severity = "Medium";
    }

    if (eventType === "Admin Access Attempt") {
      severity = "High";
    }

    const failedLoginCount = await Log.countDocuments({
      eventType: "Failed Login",
      ipAddress
    });

    if (failedLoginCount >= 5) {
      severity = "High";
    }

    const log = await Log.create({
      eventType,
      username,
      ipAddress,
      severity,
      description
    });

    if (severity === "Medium" || severity === "High") {
      await Alert.create({
        title: `${severity} Severity Alert`,
        severity,
        message: `${eventType} detected for user ${username}`,
        relatedIp: ipAddress
      });
    }

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: "Server error creating log" });
  }
});

module.exports = router;