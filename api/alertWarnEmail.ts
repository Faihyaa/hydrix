import sgMail from '@sendgrid/mail';
import { database } from '../src/lib/firebase';
import { ref, onValue, get } from 'firebase/database';
import { NextResponse } from 'next/server';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// track last sent state per sensor
let lastSentLevelBySensor = new Map<string, string>();

let isListening = false;

export async function GET() {
  if (!isListening) {
    isListening = true;
    startRealtimeMonitoring();
  }

  return NextResponse.json({ monitoring: true });
}

function startRealtimeMonitoring() {
  const sensorRef = ref(database, 'sensorData');

  onValue(sensorRef, async (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    for (const [sensorId, sensor] of Object.entries(data) as any) {
      const level = sensor.level;

      const lastLevel = lastSentLevelBySensor.get(sensorId);

      // ONLY SEND WHEN STATE CHANGES
      if (lastLevel !== level) {
        lastSentLevelBySensor.set(sensorId, level);

        await sendFloodMessage(level);

        console.log(`📧 Sent ${level} alert for ${sensorId}`);
      }
    }
  });
}

async function sendFloodMessage(level: 'warn' | 'alert') {
  const messages = {
    warn: {
      subject: 'WARNING – Flood Risk Detected',
      getHtml: (userName: string) => `
        <p>Hello ${userName},</p>
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
      getHtml: (userName: string) => `
        <p>Hello ${userName},</p>
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

    const emailPromises = Object.values(usersData)
      .filter((user: any) => user.alertEnabled === true)
      .map((user: any) =>
        sgMail.send({
          to: user.email,
          from: 'Hydrix Admin <adminhydrix@gmail.com>',
          subject: messages[level].subject,
          html: messages[level].getHtml(user.name),
        })
      );

    await Promise.all(emailPromises);

    console.log(`✅ ${level.toUpperCase()} emails sent`);
  } catch (error) {
    console.error(`SendGrid error (${level}):`, error);
  }
}