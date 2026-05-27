import type { Request, Response } from 'express';
import sgMail from '@sendgrid/mail';

const key = process.env.SENDGRID_API_KEY;

if (!key) {
  throw new Error("SENDGRID_API_KEY missing in environment variables");
}

sgMail.setApiKey(key);

export default async function handler(req: Request, res: Response) {
  try {
    // only allow POST
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, subject, message } = req.body;

    // validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await sgMail.send({
      to: 'adminhydrix@gmail.com',
      from: 'HydriX Admin <adminhydrix@gmail.com>',
      replyTo: email,
      subject: `New Contact: ${subject}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('SendGrid error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}