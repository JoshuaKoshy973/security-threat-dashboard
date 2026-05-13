const express = require("express");
const Alert = require("../models/Alert");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all alerts
router.get("/", protect, async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: "Server error getting alerts" });
  }
});

// Mark alert as resolved
router.put("/:id/resolve", protect, async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { resolved: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: "Server error resolving alert" });
  }
});

module.exports = router;