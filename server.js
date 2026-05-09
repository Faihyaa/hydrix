import "dotenv/config";
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import admin from "firebase-admin";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const serviceAccount = require("./serviceAccountKey.json");

// ==== FIREBASE INIT ====
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

// ==== CONFIG ====
const TB_URL = "http://70.153.136.4:8080";
const TB_TOKEN = "kxKsQ1pTh9xzjc9Buyrb";
const TB_EMAIL = process.env.TB_EMAIL;
const TB_PASSWORD = process.env.TB_PASSWORD;
const TB_DEVICE_ID = "3eca7a10-a665-11f0-9920-eb99db60a0b5";

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASS = process.env.GMAIL_APP_PASS;
const ALERT_RECIPIENTS = process.env.ALERT_RECIPIENTS;

// ==== NODEMAILER SETUP ====
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASS,
  },
});

// ==== EMAIL COOLDOWN ====
let lastEmailTime = 0;
const EMAIL_COOLDOWN = 10 * 60 * 1000; // 10 minutes

// ==== SEND ALERT EMAIL ====
async function sendAlertEmail(alertData) {
  const now = Date.now();
  if (now - lastEmailTime < EMAIL_COOLDOWN) {
    console.log("Email cooldown active, skipping...");
    return;
  }

  const { level, distance, rainStatus, temperature, humidity } = alertData;
  const isAlert = level === "ALERT";
  const color = isAlert ? "#dc2626" : "#d97706";
  const emoji = isAlert ? "🔴" : "🟡";
  const time = new Date().toLocaleString("en-MY");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:2px solid ${color};border-radius:12px;overflow:hidden;">
      <div style="background:${color};padding:20px;text-align:center;">
        <h1 style="color:white;margin:0;">${emoji} FlooDeT ${level} NOTIFICATION</h1>
      </div>
      <div style="padding:24px;">
        <p style="font-size:16px;">FlooDeT system has detected a critical water level change.</p>
        <table style="width:100%;border-collapse:collapse;margin-top:16px;">
          <tr style="background:#f3f4f6;">
            <td style="padding:10px;font-weight:bold;">📍 Status</td>
            <td style="padding:10px;color:${color};font-weight:bold;">${level}</td>
          </tr>
          <tr>
            <td style="padding:10px;font-weight:bold;">📏 Water Distance</td>
            <td style="padding:10px;">${distance} cm</td>
          </tr>
          <tr style="background:#f3f4f6;">
            <td style="padding:10px;font-weight:bold;">🌧️ Rain Status</td>
            <td style="padding:10px;">${rainStatus}</td>
          </tr>
          <tr>
            <td style="padding:10px;font-weight:bold;">🌡️ Temperature</td>
            <td style="padding:10px;">${temperature} °C</td>
          </tr>
          <tr style="background:#f3f4f6;">
            <td style="padding:10px;font-weight:bold;">💧 Humidity</td>
            <td style="padding:10px;">${humidity} %</td>
          </tr>
          <tr>
            <td style="padding:10px;font-weight:bold;">🕐 Time</td>
            <td style="padding:10px;">${time}</td>
          </tr>
        </table>
        <div style="margin-top:24px;padding:16px;background:#fef2f2;border-radius:8px;border-left:4px solid ${color};">
          <p style="margin:0;font-weight:bold;color:${color};">
            ${isAlert
              ? "⚠️ DANGER! Water level is critically high. Please take immediate action!"
              : "⚠️ WARNING! Water level is rising. Please monitor closely."}
          </p>
        </div>
        <p style="margin-top:20px;color:#6b7280;font-size:13px;">
          — FlooDeT Smart Flood Detection System
        </p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"FlooDeT Alert" <${GMAIL_USER}>`,
      to: ALERT_RECIPIENTS,
      subject: `${emoji} FlooDeT ${level}: Flood ${isAlert ? "DETECTED" : "WARNING"} - ${time}`,
      html,
    });
    lastEmailTime = now;
    console.log("✅ Alert email sent!");
  } catch (err) {
    console.error("❌ Email failed:", err.message);
  }
}

// ==== SAVE TO FIREBASE ====
async function saveToFirebase(sensorData) {
  try {
    await db.collection("sensorHistory").add({
      ...sensorData,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log("✅ Data saved to Firebase!");
  } catch (err) {
    console.error("❌ Firebase save failed:", err.message);
  }
}

// ==== FETCH FROM THINGSBOARD ====
async function fetchFromThingsBoard() {
  const loginRes = await fetch(`${TB_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: TB_EMAIL, password: TB_PASSWORD }),
  });
  const loginData = await loginRes.json();
  const jwtToken = loginData.token;

  const keys = "distance,temperature,humidity,pressure,rainPercent,rainStatus,level";
  const telemetryRes = await fetch(
    `${TB_URL}/api/plugins/telemetry/DEVICE/${TB_DEVICE_ID}/values/timeseries?keys=${keys}`,
    { headers: { "X-Authorization": `Bearer ${jwtToken}` } }
  );
  return await telemetryRes.json();
}

// ==== ENDPOINT 1: Latest telemetry ====
app.get("/api/telemetry", async (req, res) => {
  try {
    const data = await fetchFromThingsBoard();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==== ENDPOINT 2: Receive alert from ThingsBoard ====
let alerts = [];
app.post("/alerts", async (req, res) => {
  const data = req.body;
  const newAlert = {
    message: `Flood ${data.level || "ALERT"} detected!`,
    level: data.level,
    distance: data.distance,
    rainStatus: data.rainStatus,
    temperature: data.temperature,
    humidity: data.humidity,
    time: new Date().toISOString(),
  };

  alerts.unshift(newAlert);
  if (alerts.length > 50) alerts = alerts.slice(0, 50);
  console.log("Alert received:", newAlert);

  if (data.level === "WARN" || data.level === "ALERT") {
    await sendAlertEmail(newAlert);
  }

  res.json({ received: true });
});

// ==== ENDPOINT 3: Fetch alerts ====
app.get("/api/alerts", (req, res) => {
  res.json(alerts);
});

// ==== ENDPOINT 4: Test email ====
app.post("/api/test-email", async (req, res) => {
  await sendAlertEmail({
    level: "WARN",
    distance: "5.00",
    rainStatus: "Heavy Rain",
    temperature: "34",
    humidity: "100",
  });
  res.json({ sent: true });
});

// ==== ENDPOINT 5: Historical data from Firebase ====
app.get("/api/history", async (req, res) => {
  try {
    const snapshot = await db.collection("sensorHistory")
      .orderBy("timestamp", "desc")
      .limit(100)
      .get();

    const history = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate().toISOString() || null,
    }));

    res.json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==== AUTO FETCH & SAVE every 30 seconds ====
async function checkAndSave() {
  try {
    const data = await fetchFromThingsBoard();

    const sensorData = {
      distance: data.distance?.[0]?.value ?? null,
      temperature: data.temperature?.[0]?.value ?? null,
      humidity: data.humidity?.[0]?.value ?? null,
      pressure: data.pressure?.[0]?.value ?? null,
      rainPercent: data.rainPercent?.[0]?.value ?? null,
      rainStatus: data.rainStatus?.[0]?.value ?? null,
      level: data.level?.[0]?.value ?? null,
    };

    console.log("📡 Sensor data fetched:", sensorData);
    await saveToFirebase(sensorData);

    if (sensorData.level === "WARN" || sensorData.level === "ALERT") {
      await sendAlertEmail(sensorData);
    }

  } catch (err) {
    console.error("Auto fetch error:", err.message);
  }
}

setInterval(checkAndSave, 30000);

// ==== START SERVER ====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});