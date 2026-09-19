import nodemailer from "nodemailer";

const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = Number(process.env.EMAIL_PORT || 587);
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASSWORD) {
  console.warn(
    "Email configuration is incomplete. Contact confirmation emails will not work.",
  );
}

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_PORT === 465,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

export default transporter;
