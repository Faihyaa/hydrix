import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY); 

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email, message } = req.body;

  try {
    await sgMail.send({
      to: "your_email@gmail.com",
      from: "your_verified_sender@gmail.com",
      subject: "New Contact Form Message",
      text: `
Name: ${name}
Email: ${email}
Message: ${message}
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}