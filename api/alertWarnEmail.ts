import sgMail from '@sendgrid/mail';
import { database } from '../src/lib/firebase';
import { ref, onValue, get } from 'firebase/database';

// =====================
// SENDGRID SETUP
// =====================
const key = process.env.SENDGRID_API_KEY;

if (!key) {
  throw new Error('SENDGRID_API_KEY is missing in environment variables');
}

sgMail.setApiKey(key);

// =====================
// STATE TRACKING
// =====================
let lastSentLevelBySensor = new Map<string, string>();
let isListening = false;

// =====================
// ENTRY POINT (called by /api/alerts)
// =====================
export async function GET() {
  if (!isListening) {
    isListening = true;
    startRealtimeMonitoring();
  }

  return new Response(
    JSON.stringify({ monitoring: true }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// =====================
// FIREBASE REALTIME LISTENER
// =====================
function startRealtimeMonitoring() {
  const sensorRef = ref(database, 'sensorData');

  onValue(sensorRef, async (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    for (const [sensorId, sensor] of Object.entries(data) as any) {
      const level = sensor.level;

      const lastLevel = lastSentLevelBySensor.get(sensorId);

      // ONLY SEND IF STATE CHANGES
      if (lastLevel !== level) {
        lastSentLevelBySensor.set(sensorId, level);

        await sendFloodMessage(level);

        console.log(`📧 Sent ${level.toUpperCase()} alert for ${sensorId}`);
      }
    }
  });
}

// =====================
// SEND EMAIL FUNCTION
// =====================
async function sendFloodMessage(level: 'warn' | 'alert') {
  const messages = {
    warn: {
      subject: 'WARNING – Flood Risk Detected',
      html: (name: string) => `
        <p>Hello ${name},</p>

        <p>A potential flood risk has been detected in your area.</p>

        <ul>
          <li>Stay alert</li>
          <li>Prepare essentials</li>
          <li>Avoid risky areas</li>
        </ul>

        <p><strong>HydriX Team</strong></p>
      `
    },

    alert: {
      subject: 'ALERT – Critical Flood Risk Detected',
      html: (name: string) => `
        <p>Hello ${name},</p>

        <p><strong>Immediate evacuation recommended.</strong></p>

        <ul>
          <li>Move to higher ground</li>
          <li>Secure belongings</li>
          <li>Follow authorities</li>
        </ul>

        <p><strong>HydriX Team</strong></p>
      `
    }
  };

  try {
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);

    if (!snapshot.exists()) return;

    const usersData = snapshot.val();

    const emailJobs = Object.values(usersData)
      .filter((user: any) => user.alertEnabled === true)
      .map((user: any) =>
        sgMail.send({
          to: user.email,
          from: 'Hydrix Admin <adminhydrix@gmail.com>',
          subject: messages[level].subject,
          html: messages[level].html(user.name),
        })
      );

    await Promise.all(emailJobs);

    console.log(`✅ ${level.toUpperCase()} emails sent successfully`);
  } catch (error) {
    console.error(`❌ SendGrid error (${level}):`, error);
  }
}