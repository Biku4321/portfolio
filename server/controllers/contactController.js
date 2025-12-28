import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

export const sendMessage = async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,       // ✅ correct
      pass: process.env.SMTP_PASSWORD,    // ✅ correct
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  console.log("SMTP_EMAIL:", process.env.SMTP_EMAIL);
  console.log("SMTP_PASSWORD:", process.env.SMTP_PASSWORD);

  await transporter.sendMail({
    from: email,
    to: process.env.SMTP_EMAIL, // or hardcode your own email here
    subject: `Message from ${name}`,
    text: message,
  });

  res.json({ msg: "Message sent" });
};
