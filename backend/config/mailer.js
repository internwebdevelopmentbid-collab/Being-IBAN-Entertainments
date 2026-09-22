import nodemailer from "nodemailer";

const EMAIL_HOST = process.env.EMAIL_HOST || "smtp.gmail.com";

const EMAIL_PORT = Number(process.env.EMAIL_PORT || 587);

const EMAIL_USER = process.env.EMAIL_USER;

const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

/* ==================================================
   EMAIL CONFIGURATION CHECK
================================================== */

if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASSWORD) {
  console.warn(
    "Email configuration is incomplete. Contact confirmation emails will not work.",
  );
}

/* ==================================================
   SMTP TRANSPORTER
================================================== */

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,

  port: EMAIL_PORT,

  /*
   * Gmail:
   *
   * 587  -> STARTTLS
   * 465  -> implicit TLS
   */
  secure: EMAIL_PORT === 465,

  /*
   * Force IPv4.
   *
   * This is important for the Railway environment
   * because the SMTP hostname is resolving to IPv6,
   * while the container cannot reach that IPv6 network.
   */
  family: 4,

  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },

  /*
   * Prevent SMTP from hanging indefinitely.
   */

  connectionTimeout: 10000,

  greetingTimeout: 10000,

  socketTimeout: 15000,

  dnsTimeout: 10000,
});

export default transporter;
