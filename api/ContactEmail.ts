import sgMail from '@sendgrid/mail';
import { NextRequest, NextResponse } from 'next/server';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message }: ContactFormData =
      await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await sgMail.send({
      to: 'adminhydrix@gmail.com', // ADMIN receives email
      from: 'Hydrix Admin <adminhydrix@gmail.com>', // MUST be verified in SendGrid
      replyTo: email, // 👈 USER email (admin can reply here)
      subject: `New Contact: ${subject}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('SendGrid error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}