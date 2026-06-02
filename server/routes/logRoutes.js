const express = require("express");
const Log = require("../models/Log");
const Alert = require("../models/Alert");
const { protect } = require("../middleware/authMiddleware");
const { calculateThreatScore } = require("../services/threatScoringService");

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

// Get suspicious IP ranking based on total threat score
router.get("/suspicious-ips", protect, async (req, res) => {
  try {
    const suspiciousIps = await Log.aggregate([
      {
        $group: {
          _id: "$ipAddress",
          totalThreatScore: { $sum: "$threatScore" },
          eventCount: { $sum: 1 },
          highSeverityCount: {
            $sum: {
              $cond: [{ $eq: ["$severity", "High"] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: {
          totalThreatScore: -1
        }
      },
      {
        $limit: 5
      }
    ]);

    res.json(suspiciousIps);
  } catch (error) {
    res.status(500).json({ message: "Server error getting suspicious IPs" });
  }
});

// Create a new log
router.post("/", protect, async (req, res) => {
  try {
    const { eventType, username, ipAddress, description } = req.body;

    if (!eventType || !username || !ipAddress) {
      return res.status(400).json({
        message: "Event type, username, and IP address are required"
      });
    }

    const { threatScore, severity } = await calculateThreatScore(eventType, ipAddress);

    const log = await Log.create({
      eventType,
      username,
      ipAddress,
      severity,
      threatScore,
      description
    });

    if (severity === "Medium" || severity === "High") {
      await Alert.create({
        title: `${severity} Severity Alert`,
        severity,
        threatScore,
        message: `${eventType} detected for user ${username}. Threat score: ${threatScore}`,
        relatedIp: ipAddress
      });
    }

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: "Server error creating log" });
  }
});

module.exports = router;