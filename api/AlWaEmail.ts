import sgMail from '@sendgrid/mail';
import { database } from '../../lib/firebase';
import { ref, onValue, get } from 'firebase/database';
import { NextResponse } from 'next/server';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

let sentAlerts = new Set();

export async function GET() {
  startFloodMonitoring();
  return NextResponse.json({ monitoring: true });
}

function startFloodMonitoring() {
  const sensorRef = ref(database, 'sensorData');
  
  onValue(sensorRef, async (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    Object.entries(data).forEach(async ([sensorId, sensor]: any) => {
      const level = sensor.level;

      const alertKey = `${sensorId}-${level}`;

      if (!sentAlerts.has(alertKey)) {
        sentAlerts.add(alertKey);
        await sendFloodMessage(level);

        setTimeout(() => {
          sentAlerts.delete(alertKey);
        }, 3600000);
      }
    });
  });
}

async function sendFloodMessage(level: 'warn' | 'alert') {
  const messages = {
    warn: {
      subject: 'WARNING – Flood Risk Detected ',
      getHtml: (userName: string) => `
        <p>Hello ${userName},</p>
        
        <p>A potential flood risk has been detected in your area. Please stay alert and take early precautions:</p>
        
        <ul>
          <li>Keep essential items ready for quick access</li>
          <li>Ensure important documents are safely protected</li>
          <li>Stay updated with live system notifications</li>
          <li>Avoid unnecessary movement in flood-prone areas</li>
        </ul>
        
        <p>Please continue to monitor system updates for any changes in risk level and stay updated with local authorities for further instructions.</p>
        
        <p>Stay safe,<br/>
        <strong>HydriX Team</strong></p>
      `
    },
    alert: {
      subject: 'ALERT – Critical Flood Risk Detected',
      getHtml: (userName: string) => `
        <p>Hello ${userName},</p>
        
        <p>A critical flood risk has been detected in your area. Current conditions indicate dangerous water levels and a high likelihood of flooding.</p>
        
        <p><strong>Immediate action is required:</strong></p>
        
        <ul>
          <li>Secure essential belongings without delay</li>
          <li>Protect important documents and devices</li>
          <li>Move to higher and safer ground immediately</li>
          <li>Avoid all flood-prone and low-lying areas</li>
        </ul>
        
        <p>Please follow system updates closely and comply with any instructions issued by local authorities.</p>
        
        <p>Stay safe,<br/>
        <strong>HydriX Team</strong></p>
      `
    }
  };

  try {
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);

    if (!snapshot.exists()) {
      console.log('No users found');
      return;
    }

    const usersData = snapshot.val();
    const emailPromises = Object.values(usersData)
      .filter((user: any) => user.alertEnabled === true)
      .map((user: any) =>
        sgMail.send({
          to: user.email,
          from: 'adminhydrix@gmail.com',
          subject: messages[level].subject,
          html: messages[level].getHtml(user.name),
        })
      );

    await Promise.all(emailPromises);
    console.log(`${level.toUpperCase()} alerts sent to ${emailPromises.length} users`);
  } catch (error) {
    console.error(`Failed to send ${level}:`, error);
  }
}