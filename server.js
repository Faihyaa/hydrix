import "dotenv/config";
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import admin from "firebase-admin";
import { readFileSync } from "fs";

// Load service account directly from file — no base64 needed
const serviceAccount = JSON.parse(readFileSync("./serviceAccountKey.json", "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://floodet2-default-rtdb.asia-southeast1.firebasedatabase.app",
});
const db = admin.database();

const app = express();
app.use(cors());
app.use(express.json());

// ==== CONFIG ====
const TB_URL = "http://70.153.136.4:8080";
const TB_TOKEN = "kxKsQ1pTh9xzjc9Buyrb";
const TB_EMAIL = process.env.TB_EMAIL;
const TB_PASSWORD = process.env.TB_PASSWORD;
const TB_DEVICE_ID = "f72beee0-d9cd-11f0-8463-1fcaa679e0db";

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
    console.log("📧 Email cooldown active, skipping...");
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

// ==== SAVE TO FIREBASE (Realtime Database) ====
async function saveToFirebase(sensorData) {
  try {
    const payload = {
      ...sensorData,
      timestamp: Date.now(),
    };

    // Save latest — overwrites every time
    await db.ref("sensorData/latest").set(payload);

    // Save history — push() creates unique key each time
    await db.ref("sensorHistory").push(payload);

    console.log("✅ Firebase saved:", JSON.stringify(sensorData));
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

  if (!loginRes.ok) {
    throw new Error(`ThingsBoard login failed: ${loginRes.status} ${loginRes.statusText}`);
  }

  const loginData = await loginRes.json();
  const jwtToken = loginData.token;

  if (!jwtToken) {
    throw new Error("ThingsBoard login returned no token — check TB_EMAIL and TB_PASSWORD in .env");
  }

  const keys = "distance,temperature,humidity,pressure,rainPercent,rainStatus,level";
  const telemetryRes = await fetch(
    `${TB_URL}/api/plugins/telemetry/DEVICE/${TB_DEVICE_ID}/values/timeseries?keys=${keys}&useStrictDataTypes=false&limit=1`,
    { headers: { "X-Authorization": `Bearer ${jwtToken}` } }
  );

  if (!telemetryRes.ok) {
    throw new Error(`ThingsBoard telemetry fetch failed: ${telemetryRes.status} ${telemetryRes.statusText}`);
  }

  return await telemetryRes.json();
}

// ==== ENDPOINT 1: Latest telemetry ====
app.get("/api/telemetry", async (req, res) => {
  try {
    const data = await fetchFromThingsBoard();
    res.json({ success: true, data });
  } catch (err) {
    console.error("❌ /api/telemetry error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==== ENDPOINT 2: Receive alert from ThingsBoard Rule Chain ====
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
  console.log("🚨 Alert received:", newAlert);

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

// ==== ENDPOINT 5: Historical data from Firebase Realtime Database ====
// FIX: was using Firestore syntax (db.collection) — now uses Realtime Database correctly
app.get("/api/history", async (req, res) => {
  try {
    const snapshot = await db.ref("sensorHistory")
      .orderByChild("timestamp")
      .limitToLast(100)
      .once("value");

    const history = [];
    snapshot.forEach((child) => {
      const data = child.val();
      history.push({
        id: child.key,
        ...data,
        timestamp: data.timestamp ? new Date(data.timestamp).toISOString() : null,
      });
    });

    history.reverse(); // latest first
    res.json({ success: true, data: history });
  } catch (err) {
    console.error("❌ /api/history error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==== ENDPOINT 6: Health check — use this to debug connection issues ====
app.get("/api/health", async (req, res) => {
  const result = {
    server: "ok",
    timestamp: new Date().toISOString(),
    thingsboard: "unknown",
    firebase: "unknown",
    env: {
      TB_EMAIL: TB_EMAIL ? "✅ set" : "❌ missing",
      TB_PASSWORD: process.env.TB_PASSWORD ? "✅ set" : "❌ missing",
      GMAIL_USER: GMAIL_USER ? "✅ set" : "❌ missing",
      GMAIL_APP_PASS: GMAIL_APP_PASS ? "✅ set" : "❌ missing",
      ALERT_RECIPIENTS: ALERT_RECIPIENTS ? "✅ set" : "❌ missing",
      FIREBASE_SERVICE_ACCOUNT_BASE64: process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 ? "✅ set" : "❌ missing",
    },
  };

  // Test ThingsBoard
  try {
    const loginRes = await fetch(`${TB_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: TB_EMAIL, password: TB_PASSWORD }),
    });
    const loginData = await loginRes.json();
    result.thingsboard = loginData.token ? "✅ connected" : `❌ login failed: ${JSON.stringify(loginData)}`;
  } catch (err) {
    result.thingsboard = `❌ unreachable: ${err.message}`;
  }

  // Test Firebase
  try {
    await db.ref("sensorData/latest").once("value");
    result.firebase = "✅ connected";
  } catch (err) {
    result.firebase = `❌ error: ${err.message}`;
  }

  res.json(result);
});

// ==== AUTO FETCH & SAVE every 5 seconds ====
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

    console.log("📡 Fetched:", JSON.stringify(sensorData));
    await saveToFirebase(sensorData);

    if (sensorData.level === "WARN" || sensorData.level === "ALERT") {
      await sendAlertEmail(sensorData);
    }

  } catch (err) {
    // FIX: log full error so you know exactly why fetch is failing
    console.error("❌ checkAndSave failed:", err.message);
  }
}

// Run immediately on start, then every 5 seconds
checkAndSave();
setInterval(checkAndSave, 5000);

// ==== START SERVER ====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ FlooDeT server running on port ${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
});