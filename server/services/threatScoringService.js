const Log = require("../models/Log");

const EVENT_WEIGHTS = {
  "Failed Login": 25,
  "Admin Access Attempt": 60,
  "Unknown IP Login": 45,
  "Password Reset Attempt": 35,
  "Suspicious File Access": 50,
  "Successful Login": 10
};

const calculateSeverity = (score) => {
  if (score >= 75) {
    return "High";
  }

  if (score >= 40) {
    return "Medium";
  }

  return "Low";
};

const calculateThreatScore = async (eventType, ipAddress) => {
  let score = EVENT_WEIGHTS[eventType] || 15;

  const recentFailedLogins = await Log.countDocuments({
    eventType: "Failed Login",
    ipAddress
  });

  if (recentFailedLogins >= 5) {
    score += 50;
  } else if (recentFailedLogins >= 3) {
    score += 30;
  } else if (recentFailedLogins >= 1) {
    score += 10;
  }

  const recentEventsFromIp = await Log.countDocuments({
    ipAddress
  });

  if (recentEventsFromIp >= 10) {
    score += 30;
  } else if (recentEventsFromIp >= 5) {
    score += 15;
  }

  const severity = calculateSeverity(score);

  return {
    threatScore: score,
    severity
  };
};

module.exports = {
  calculateThreatScore,
  calculateSeverity
};