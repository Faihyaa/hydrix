import nodemailer from '../nodemailer';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !subject || !message) {
    res.status(400).json({ error: 'All fields are required.' });
    return;
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASS) {
    console.error('❌ /api/contact failed: missing Gmail credentials');
    res.status(500).json({ error: 'Email server is not configured.' });
    return;
  }

  try {
    await transporter.sendMail({
      from: `"HydriX Contact" <${process.env.GMAIL_USER}>`,
      to: 'adminhydrix@gmail.com',
      subject: `Contact Form: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong><br/>${String(message).replace(/\n/g, '<br/>')}</p>`,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ /api/contact failed:', error);
    res.status(500).json({ error: 'Failed to send contact message.' });
  }
}
