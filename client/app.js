const API_URL = "http://localhost:5001/api";

let token = "";

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const status = document.getElementById("login-status");

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      status.textContent = data.message || "Login failed";
      return;
    }

    token = data.token;
    status.textContent = "Login successful";
    loadDashboard();
  } catch (error) {
    status.textContent = "Error connecting to server";
  }
}

async function createLog() {
  const eventType = document.getElementById("eventType").value;
  const username = document.getElementById("username").value;
  const ipAddress = document.getElementById("ipAddress").value;
  const description = document.getElementById("description").value;
  const status = document.getElementById("log-status");

  if (!token) {
    status.textContent = "Please login first";
    return;
  }

  try {
    const response = await fetch(`${API_URL}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        eventType,
        username,
        ipAddress,
        description
      })
    });

    const data = await response.json();

    if (!response.ok) {
      status.textContent = data.message || "Failed to create log";
      return;
    }

    status.textContent = `Log created with severity: ${data.severity}`;
    loadDashboard();
  } catch (error) {
    status.textContent = "Error creating log";
  }
}

async function loadDashboard() {
  if (!token) {
    return;
  }

  try {
    const logsResponse = await fetch(`${API_URL}/logs`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const alertsResponse = await fetch(`${API_URL}/alerts`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const suspiciousIpsResponse = await fetch(`${API_URL}/logs/suspicious-ips`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const logs = await logsResponse.json();
    const alerts = await alertsResponse.json();
    const suspiciousIps = await suspiciousIpsResponse.json();

    document.getElementById("total-logs").textContent = logs.length;
    document.getElementById("total-alerts").textContent = alerts.length;

    const highAlerts = alerts.filter(alert => alert.severity === "High");
    document.getElementById("high-alerts").textContent = highAlerts.length;

    displayAlerts(alerts);
    displaySuspiciousIps(suspiciousIps);
  } catch (error) {
    console.error("Dashboard loading error:", error);
  }
}

function displayAlerts(alerts) {
  const alertsList = document.getElementById("alerts-list");
  alertsList.innerHTML = "";

  if (alerts.length === 0) {
    alertsList.innerHTML = "<p>No alerts found.</p>";
    return;
  }

  alerts.forEach(alert => {
    const div = document.createElement("div");
    div.className = `alert ${alert.severity.toLowerCase()}`;
    div.innerHTML = `
      <strong>${alert.title}</strong>
      <p>${alert.message}</p>
      <p><strong>Severity:</strong> ${alert.severity}</p>
      <p><strong>Threat Score:</strong> ${alert.threatScore}</p>
      <p><strong>Related IP:</strong> ${alert.relatedIp || "N/A"}</p>
      <p><strong>Resolved:</strong> ${alert.resolved ? "Yes" : "No"}</p>
    `;
    alertsList.appendChild(div);
  });
}

function displaySuspiciousIps(suspiciousIps) {
  const ipList = document.getElementById("suspicious-ip-list");
  ipList.innerHTML = "";

  if (suspiciousIps.length === 0) {
    ipList.innerHTML = "<p>No suspicious IP activity found.</p>";
    return;
  }

  suspiciousIps.forEach(ip => {
    const div = document.createElement("div");
    div.className = "alert high";
    div.innerHTML = `
      <strong>${ip._id}</strong>
      <p><strong>Total Threat Score:</strong> ${ip.totalThreatScore}</p>
      <p><strong>Event Count:</strong> ${ip.eventCount}</p>
      <p><strong>High Severity Events:</strong> ${ip.highSeverityCount}</p>
    `;
    ipList.appendChild(div);
  });
}