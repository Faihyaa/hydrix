import "dotenv/config";
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

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

// ==== COOLDOWN (elak spam email) ====
let lastEmailTime = 0;
const EMAIL_COOLDOWN = 10 * 60 * 1000; // 10 minit

// ==== SEND EMAIL FUNCTION ====
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
  const time = new Date().toLocaleString("ms-MY");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:2px solid ${color};border-radius:12px;overflow:hidden;">
      <div style="background:${color};padding:20px;text-align:center;">
        <h1 style="color:white;margin:0;">${emoji} FlooDeT ${level} NOTIFICATION</h1>
      </div>
      <div style="padding:24px;">
        <p style="font-size:16px;">Sistem FlooDeT telah mengesan perubahan paras air yang membimbangkan.</p>
        <table style="width:100%;border-collapse:collapse;margin-top:16px;">
          <tr style="background:#f3f4f6;">
            <td style="padding:10px;font-weight:bold;">📍 Status</td>
            <td style="padding:10px;color:${color};font-weight:bold;">${level}</td>
          </tr>
          <tr>
            <td style="padding:10px;font-weight:bold;">📏 Jarak Air</td>
            <td style="padding:10px;">${distance} cm</td>
          </tr>
          <tr style="background:#f3f4f6;">
            <td style="padding:10px;font-weight:bold;">🌧️ Status Hujan</td>
            <td style="padding:10px;">${rainStatus}</td>
          </tr>
          <tr>
            <td style="padding:10px;font-weight:bold;">🌡️ Suhu</td>
            <td style="padding:10px;">${temperature} °C</td>
          </tr>
          <tr style="background:#f3f4f6;">
            <td style="padding:10px;font-weight:bold;">💧 Kelembapan</td>
            <td style="padding:10px;">${humidity} %</td>
          </tr>
          <tr>
            <td style="padding:10px;font-weight:bold;">🕐 Masa</td>
            <td style="padding:10px;">${time}</td>
          </tr>
        </table>
        <div style="margin-top:24px;padding:16px;background:#fef2f2;border-radius:8px;border-left:4px solid ${color};">
          <p style="margin:0;font-weight:bold;color:${color};">
            ${isAlert
              ? "⚠️ BAHAYA! Paras air sangat kritikal. Sila ambil tindakan segera!"
              : "⚠️ AMARAN! Paras air meningkat. Sila pantau dengan teliti."}
          </p>
        </div>
        <p style="margin-top:20px;color:#6b7280;font-size:13px;">
          — FlooDeT Flood Detection System
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

// ==== ENDPOINT 1: Latest telemetry ====
app.get("/api/telemetry", async (req, res) => {
  try {
    // Login dapat JWT token
    const loginRes = await fetch(`${TB_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: TB_EMAIL,
        password: TB_PASSWORD
      })
    });
    const loginData = await loginRes.json();
    const jwtToken = loginData.token;

    // Baca telemetry dari device
    const keys = "distance,temperature,humidity,pressure,rainPercent,rainStatus,level";
    const telemetryRes = await fetch(
      `${TB_URL}/api/plugins/telemetry/DEVICE/${TB_DEVICE_ID}/values/timeseries?keys=${keys}`,
      { headers: { "X-Authorization": `Bearer ${jwtToken}` } }
    );
    const data = await telemetryRes.json();
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

  // Auto send email kalau WARN atau ALERT
  if (data.level === "WARN" || data.level === "ALERT") {
    await sendAlertEmail(newAlert);
  }

  res.json({ received: true });
});

// ==== ENDPOINT 3: Website fetch alerts ====
app.get("/api/alerts", (req, res) => {
  res.json(alerts);
});

// ==== ENDPOINT 4: Manual test email ====
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

// ==== ENDPOINT 5: Auto check & alert dari ThingsBoard ====
async function checkAndAlert() {
  try {
    const loginRes = await fetch(`${TB_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: TB_EMAIL,
        password: TB_PASSWORD
      })
    });
    const loginData = await loginRes.json();
    const jwtToken = loginData.token;

    const keys = "distance,temperature,humidity,pressure,rainPercent,rainStatus,level";
    const telemetryRes = await fetch(
      `${TB_URL}/api/plugins/telemetry/DEVICE/${TB_DEVICE_ID}/values/timeseries?keys=${keys}`,
      { headers: { "X-Authorization": `Bearer ${jwtToken}` } }
    );
    const data = await telemetryRes.json();

    const level = data.level?.[0]?.value;
    const distance = data.distance?.[0]?.value;
    const rainStatus = data.rainStatus?.[0]?.value;
    const temperature = data.temperature?.[0]?.value;
    const humidity = data.humidity?.[0]?.value;

    if (level === "WARN" || level === "ALERT") {
      await sendAlertEmail({ level, distance, rainStatus, temperature, humidity });
    }

  } catch (err) {
    console.error("Auto check error:", err.message);
  }
}

// Auto check setiap 30 saat
setInterval(checkAndAlert, 30000);

// ==== START ====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});