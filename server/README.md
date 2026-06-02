# Security Threat Monitoring Dashboard

## Overview

This project is a full-stack security threat monitoring application created for CS 499. It simulates a simplified SOC/SIEM-style workflow by allowing users to authenticate, create security logs, store events in MongoDB Atlas, assign threat severity, and automatically generate alerts for suspicious activity.

## Technologies Used

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcrypt
- HTML
- CSS
- JavaScript
- Postman

## Current Features

- User registration and login
- Password hashing with bcrypt
- JWT authentication
- Protected API routes
- MongoDB Atlas database connection
- Mongoose models for users, logs, and alerts
- Security log creation
- Basic threat severity assignment
- Automatic alert generation
- Alert retrieval
- Basic frontend dashboard
- Dashboard summary cards for logs and alerts
- Basic input validation and improved error responses

## Software Design/Engineering Enhancement

For CS 499 Milestone Two, this artifact was enhanced from a backend-only API into a more complete full-stack security monitoring application. A frontend dashboard was added using HTML, CSS, and JavaScript to allow users to log in, create security events, and view alert data. Backend validation was also added to improve reliability, defensive programming, and user feedback.

## Algorithms and Data Structures Enhancement

For CS 499 Milestone Three, this project was enhanced with a weighted threat scoring algorithm, alert prioritization, and suspicious IP ranking.

The enhanced algorithm assigns numeric threat scores to security events based on event type and repeated activity from the same IP address. Events such as failed logins, admin access attempts, suspicious file access, and unknown IP logins are assigned different weights. The final threat score determines whether an event is classified as Low, Medium, or High severity.

The application also includes suspicious IP ranking using aggregation, grouping, sorting, and limiting. This allows the dashboard to display the top IP addresses with the highest total threat scores.

## Project Structure

```text
client/
  index.html
  style.css
  app.js

server/
  config/
    db.js
  middleware/
    authMiddleware.js
  models/
    User.js
    Log.js
    Alert.js
  routes/
    authRoutes.js
    logRoutes.js
    alertRoutes.js
  server.js