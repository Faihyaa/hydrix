import "dotenv/config";
import express from "express";
import cors from "cors";
import sgMail from "@sendgrid/mail";
import admin from "firebase-admin";

const app = express(); // ✅ MUST BE FIRST

app.use(cors());
app.use(express.json()); // ✅ body parser FIRST

// =====================
// SENDGRID SETUP
// =====================
const sgApiKey = process.env.SENDGRID_API_KEY;
if (!sgApiKey) {
  throw new Error("SENDGRID_API_KEY is missing in environment variables");
}
sgMail.setApiKey(sgApiKey);

// =====================
// FIREBASE SETUP
// =====================
const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, "base64").toString("utf-8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://floodet2-default-rtdb.asia-southeast1.firebasedatabase.app",
});
const db = admin.database();
const firestore = admin.firestore();

// =====================
// STATE TRACKING (MOVED TO FIREBASE)
// =====================
let isListeningToRealtimeMonitoring = false;

// ==== CONFIG ====
const TB_URL = "http://70.153.136.4:8080";
const TB_TOKEN = "kxKsQ1pTh9xzjc9Buyrb";
const TB_EMAIL = process.env.TB_EMAIL;
const TB_PASSWORD = process.env.TB_PASSWORD;
const TB_DEVICE_ID = "f72beee0-d9cd-11f0-8463-1fcaa679e0db";

const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || "noreply@hydrix.com";
const ALERT_RECIPIENTS = process.env.ALERT_RECIPIENTS;

// ==== GET RECIPIENTS FROM FIRESTORE ====
async function getAlertRecipients() {
  try {
    const snapshot = await firestore
      .collection("users")
      .where("alertEnabled", "==", true)
      .get();
    
    const emails = [];
    snapshot.forEach((doc) => {
      if (doc.data().email) {
        emails.push(doc.data().email);
      }
    });
    
    console.log(`📋 Found ${emails.length} subscribed users`);
    return emails;
  } catch (err) {
    console.error("❌ Firestore read failed:", err.message);
    return ALERT_RECIPIENTS ? ALERT_RECIPIENTS.split(",") : [];
  }
}

// =====================
// HELPER: Get Last Sent Level from Firebase
// =====================
async function getLastSentLevel() {
  try {
    const snapshot = await db.ref("alertState/lastSentLevel").once("value");
    return snapshot.val() || null;
  } catch (err) {
    console.error("❌ Failed to get last sent level:", err.message);
    return null;
  }
}

// =====================
// HELPER: Save Last Sent Level to Firebase
// =====================
async function saveLastSentLevel(level) {
  try {
    await db.ref("alertState/lastSentLevel").set(level);
  } catch (err) {
    console.error("❌ Failed to save last sent level:", err.message);
  }
}

// =====================
// REAL-TIME FIREBASE LISTENER
// =====================
function startRealtimeMonitoring() {
  const sensorRef = db.ref("sensorData");

  sensorRef.on("value", async (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    // Get last sent level from Firebase (persistent across restarts)
    const lastLevel = await getLastSentLevel();

    // Handle 'latest' structure
    if (data.latest) {
      const level = data.latest.level;

      // ONLY SEND IF STATE CHANGES
      if (lastLevel !== level) {
        if (level === "WARN" || level === "ALERT") {
          // Send WARN or ALERT email
          await sendFloodMessage(level, data.latest);
          await saveLastSentLevel(level);
          console.log(`📧 Sent ${level.toUpperCase()} alert`);
        } else if (level === "SAFE" && (lastLevel === "WARN" || lastLevel === "ALERT")) {
          // Send SAFE email ONLY if coming from WARN or ALERT
          await sendSafeMessage(data.latest);
          await saveLastSentLevel(level);
          console.log(`📧 Sent SAFE all-clear email`);
        } else {
          // Level changed but not to WARN/ALERT/SAFE - just update state
          await saveLastSentLevel(level);
        }
      }
    }
  }, (err) => {
    console.error("❌ Firebase listener error:", err.message);
  });
}

// =====================
// EMAIL TEMPLATES & SENDING
// =====================

const messages = {
  WARN: {
    subject: "WARNING – Flood Risk Detected",
    html: (name) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #d97706; border-radius: 8px; overflow: hidden;">
        <div style="background: #d97706; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 500; letter-spacing: 0.5px;">WARNING – Flood Risk Detected</h1>
        </div>
        <div style="padding: 32px; line-height: 1.6;">
          <p style="font-size: 15px; margin: 0 0 16px 0; color: #6b7280;">Hello ${name},</p>
          
          <p style="font-size: 15px; margin: 0 0 20px 0; color: #6b7280;">A potential flood risk has been detected in your area. Please stay alert and take early precautions:</p>
          
          <table style="width: 100%; margin: 24px 0; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; font-size: 14px; color: #6b7280;">Water Level Distance</td>
              <td style="padding: 12px 0; font-size: 14px; color: #6b7280; text-align: right; font-weight: 500;">${sensorData.distance || "-"} cm</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; font-size: 14px; color: #6b7280;">Temperature</td>
              <td style="padding: 12px 0; font-size: 14px; color: #6b7280; text-align: right; font-weight: 500;">${sensorData.temperature || "-"}°C</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-size: 14px; color: #6b7280;">Rain Status</td>
              <td style="padding: 12px 0; font-size: 14px; color: #6b7280; text-align: right; font-weight: 500;">${sensorData.rainStatus || "-"}</td>
            </tr>
          </table>

          <div style="margin: 24px 0; padding: 16px; background: #f5f5f5; border-left: 4px solid #d97706; border-radius: 4px;">
            <ul style="margin: 0; padding-left: 20px; font-size: 15px; color: #6b7280;">
              <li>Keep essential items ready for quick access</li>
              <li>Ensure important documents are safely protected</li>
              <li>Stay updated with live system notifications</li>
              <li>Avoid unnecessary movement in flood-prone areas</li>
            </ul>
          </div>

          <p style="font-size: 15px; margin: 0 0 20px 0; color: #6b7280;">Please continue to monitor system updates for any changes in risk level and stay updated with local authorities for further instructions.<br></p>

          <p style="font-size: 14px; margin: 0; color: #6b7280;">Stay safe,<br><strong>HydriX Team</strong></p>
        </div>
      </div>
    `
  },

  ALERT: {
    subject: "ALERT – Critical Flood Risk Detected",
    html: (name) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #dc2626; border-radius: 8px; overflow: hidden;">
        <div style="background: #dc2626; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 500; letter-spacing: 0.5px;">ALERT – Critical Flood Risk Detected</h1>
        </div>
        <div style="padding: 32px; line-height: 1.6;">
          <p style="font-size: 15px; margin: 0 0 16px 0; color: #6b7280;">Hello ${name},</p>
          
          <p style="font-size: 15px; margin: 0 0 20px 0; color: #6b7280;"><strong>A critical flood risk has been detected in your area. Current conditions indicate dangerous water levels and a high likelihood of flooding.</strong></p>
          
          <table style="width: 100%; margin: 24px 0; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; font-size: 14px; color: #6b7280;">Water Level Distance</td>
              <td style="padding: 12px 0; font-size: 14px; color: #6b7280; text-align: right; font-weight: 500;">${sensorData.distance || "-"} cm</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; font-size: 14px; color: #6b7280;">Temperature</td>
              <td style="padding: 12px 0; font-size: 14px; color: #6b7280; text-align: right; font-weight: 500;">${sensorData.temperature || "-"}°C</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-size: 14px; color: #6b7280;">Rain Status</td>
              <td style="padding: 12px 0; font-size: 14px; color: #6b7280; text-align: right; font-weight: 500;">${sensorData.rainStatus || "-"}</td>
            </tr>
          </table>

          <p style="font-size: 15px; margin: 0 0 20px 0; color: #6b7280;"><strong>Immediate action is required:</strong></p>

          <div style="margin: 24px 0; padding: 16px; background: #f5f5f5; border-left: 4px solid #dc2626; border-radius: 4px;">
            <ul style="margin: 0; padding-left: 20px; font-size: 15px; color: #6b7280;">
              <li>Secure essential belongings without delay</li>
              <li>Protect important documents and devices</li>
              <li>Move to higher and safer ground immediately</li>
              <li>Avoid all flood-prone and low-lying areas</li>
            </ul>
          </div>

          <p style="font-size: 15px; margin: 0 0 20px 0; color: #6b7280;"><strong>Please follow system updates closely and comply with any instructions issued by local authorities.<br></strong></p>

          <p style="font-size: 14px; margin: 0; color: #6b7280;">Stay safe,<br><strong>HydriX Team</strong></p>
        </div>
      </div>
    `
  },

  SAFE: {
    subject: "✅ All Clear – Flood Risk Status Update",
    html: (name) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #10b981; border-radius: 8px; overflow: hidden;">
        <div style="background: #10b981; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 18px; font-weight: 500;">✅ All Clear – Status Update</h1>
        </div>
        <div style="padding: 24px; line-height: 1.6;">
          <p style="font-size: 14px; margin: 0 0 12px 0; color: #6b7280;">Hello ${name},</p>
          
          <p style="font-size: 14px; margin: 0 0 16px 0; color: #6b7280;">Good news! The flood risk has subsided. Water levels are returning to safe conditions.</p>
          
          <p style="font-size: 14px; margin: 0 0 16px 0; color: #6b7280;">You can resume normal activities, but continue monitoring system updates for any changes.</p>

          <p style="font-size: 14px; margin: 0; color: #6b7280;">Stay safe,<br><strong>HydriX Team</strong></p>
        </div>
      </div>
    `
  }
};

// =====================
// SEND FLOOD MESSAGE (WARN/ALERT)
// =====================
async function sendFloodMessage(level, sensorData = {}) {
  try {
    const usersSnapshot = await firestore.collection("users").where("alertEnabled", "==", true).get();
    
    if (usersSnapshot.empty) {
      console.log("⚠️ No users with alerts enabled");
      return;
    }

    const emailJobs = [];
    usersSnapshot.forEach((doc) => {
      const user = doc.data();
      if (user.email) {
        emailJobs.push(
          sgMail.send({
            to: user.email,
            from: SENDGRID_FROM_EMAIL,
            subject: messages[level].subject,
            html: messages[level].html(user.name || "Valued User"),
          })
        );
      }
    });

    await Promise.all(emailJobs);
    console.log(`✅ ${level.toUpperCase()} emails sent to ${emailJobs.length} users`);
  } catch (error) {
    console.error(`❌ SendGrid error (${level}):`, error.message);
  }
}

// =====================
// SEND SAFE MESSAGE (NEW)
// =====================
async function sendSafeMessage(sensorData = {}) {
  try {
    const usersSnapshot = await firestore.collection("users").where("alertEnabled", "==", true).get();
    
    if (usersSnapshot.empty) {
      console.log("⚠️ No users with alerts enabled");
      return;
    }

    const emailJobs = [];
    usersSnapshot.forEach((doc) => {
      const user = doc.data();
      if (user.email) {
        emailJobs.push(
          sgMail.send({
            to: user.email,
            from: SENDGRID_FROM_EMAIL,
            subject: messages.SAFE.subject,
            html: messages.SAFE.html(user.name || "Valued User"),
          })
        );
      }
    });

    await Promise.all(emailJobs);
    console.log(`✅ SAFE emails sent to ${emailJobs.length} users`);
  } catch (error) {
    console.error(`❌ SendGrid error (SAFE):`, error.message);
  }
}

// =====================
// LEGACY sendAlertEmail (for backward compatibility)
// =====================
async function sendAlertEmail(alertData) {
  await sendFloodMessage(alertData.level, alertData);
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

  const keys = "distance,temperature,humidity,rainPercent,rainStatus,level";
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
    await sendFloodMessage(data.level, newAlert);
  }

  res.json({ received: true });
});

// ==== ENDPOINT 3: Fetch alerts ====
app.get("/api/alerts", (req, res) => {
  res.json(alerts);
});

// ==== ENDPOINT 4: Test email ====
app.post("/api/test-email", async (req, res) => {
  await sendFloodMessage("WARN", {
    distance: "5.00",
    rainStatus: "Heavy Rain",
    temperature: "34",
    humidity: "100",
  });
  res.json({ sent: true });
});

// ==== ENDPOINT 4B: Test SAFE email ====
app.post("/api/test-safe-email", async (req, res) => {
  await sendSafeMessage({
    distance: "10.00",
    rainStatus: "No Rain",
    temperature: "28",
    humidity: "60",
  });
  res.json({ sent: true });
});

// ==== ENDPOINT 5: Contact form submission (Using SendGrid) ====
app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    await sgMail.send({
      to: "adminhydrix@gmail.com",
      from: "HydriX Admin <adminhydrix@gmail.com>",
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Contact error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// ==== ENDPOINT 6: Historical data from Firebase Realtime Database ====
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

// ==== ENDPOINT 7: User register (save to Firestore) ====
app.post("/api/users/register", async (req, res) => {
  const { uid, email, name, notifications } = req.body;
  
  if (!uid || !email) {
    return res.status(400).json({ error: "uid and email required" });
  }

  try {
    await firestore.collection("users").doc(uid).set({
      email,
      name: name || "",
      alertEnabled: notifications ?? true,
      createdAt: Date.now(),
    }, { merge: true });

    console.log(`✅ User registered: ${email}`);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Register failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ==== ENDPOINT 8: Health check ====
app.get("/api/health", async (req, res) => {
  const result = {
    server: "ok",
    timestamp: new Date().toISOString(),
    thingsboard: "unknown",
    firebase: "unknown",
    realtimeMonitoring: isListeningToRealtimeMonitoring ? "✅ active" : "⚠️ inactive",
    env: {
      TB_EMAIL: TB_EMAIL ? "✅ set" : "❌ missing",
      TB_PASSWORD: process.env.TB_PASSWORD ? "✅ set" : "❌ missing",
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? "✅ set" : "❌ missing",
      SENDGRID_FROM_EMAIL: SENDGRID_FROM_EMAIL ? "✅ set" : "❌ missing",
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
      rainPercent: data.rainPercent?.[0]?.value ?? null,
      rainStatus: data.rainStatus?.[0]?.value ?? null,
      level: data.level?.[0]?.value ?? null,
    };

    console.log("📡 Fetched:", JSON.stringify(sensorData));
    await saveToFirebase(sensorData);

  } catch (err) {
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

  // Start real-time Firebase monitoring
  if (!isListeningToRealtimeMonitoring) {
    isListeningToRealtimeMonitoring = true;
    startRealtimeMonitoring();
    console.log("📡 Real-time Firebase monitoring started");
  }
});