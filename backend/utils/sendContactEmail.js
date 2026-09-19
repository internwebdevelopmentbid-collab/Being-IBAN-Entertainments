import transporter from "../config/mailer.js";

const sendContactEmail = async (contact) => {
  if (!contact.email) {
    throw new Error("Contact email is missing.");
  }

  const mailOptions = {
    /*
     * This must be the email account configured
     * in EMAIL_USER.
     */
    from: `"Being IBAN Entertainments" <${process.env.EMAIL_USER}>`,

    /*
     * IMPORTANT:
     * The email entered by the visitor receives
     * the confirmation email.
     */
    to: contact.email,

    /*
     * If the recipient replies to the confirmation,
     * their reply goes to your business email.
     */
    replyTo: process.env.EMAIL_USER,

    subject: "Thank You for Contacting Being IBAN Entertainments",

    text: `
Hello ${contact.name},

Thank you for contacting Being IBAN Entertainments.

We have successfully received your inquiry and our team will review your message.

We will get back to you as soon as possible.

Your submitted details:

Name: ${contact.name}
Email: ${contact.email}
Phone: ${contact.phone}

Message:
${contact.message}

Regards,
Being IBAN Entertainments
    `.trim(),

    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Thank You</title>
        </head>

        <body
          style="
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
            font-family: Arial, Helvetica, sans-serif;
          "
        >

          <div
            style="
              max-width: 650px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            "
          >

            <!-- Header -->

            <div
              style="
                background-color: #000000;
                padding: 30px;
                text-align: center;
              "
            >
              <h1
                style="
                  margin: 0;
                  color: #ffffff;
                  font-size: 26px;
                  font-weight: 700;
                "
              >
                Being IBAN Entertainments
              </h1>

              <p
                style="
                  margin: 10px 0 0;
                  color: #aaaaaa;
                  font-size: 14px;
                "
              >
                Thank you for contacting us
              </p>
            </div>

            <!-- Content -->

            <div style="padding: 35px;">

              <h2
                style="
                  margin: 0 0 20px;
                  color: #111111;
                  font-size: 22px;
                "
              >
                Hello ${contact.name},
              </h2>

              <p
                style="
                  color: #444444;
                  font-size: 15px;
                  line-height: 1.7;
                "
              >
                Thank you for contacting
                <strong>Being IBAN Entertainments</strong>.
              </p>

              <p
                style="
                  color: #444444;
                  font-size: 15px;
                  line-height: 1.7;
                "
              >
                We have successfully received your inquiry.
                Our team will review your message and get back
                to you as soon as possible.
              </p>

              <!-- Submitted Message -->

              <div
                style="
                  margin-top: 30px;
                  padding: 22px;
                  background-color: #f7f7f7;
                  border-radius: 8px;
                  border: 1px solid #eeeeee;
                "
              >

                <h3
                  style="
                    margin: 0 0 15px;
                    color: #111111;
                    font-size: 17px;
                  "
                >
                  Your Message
                </h3>

                <p
                  style="
                    margin: 0;
                    color: #555555;
                    font-size: 14px;
                    line-height: 1.7;
                    white-space: pre-wrap;
                  "
                >
                  ${contact.message}
                </p>

              </div>

              <!-- Contact Details -->

              <div
                style="
                  margin-top: 25px;
                  padding: 22px;
                  background-color: #ffffff;
                  border: 1px solid #eeeeee;
                  border-radius: 8px;
                "
              >

                <h3
                  style="
                    margin: 0 0 15px;
                    color: #111111;
                    font-size: 17px;
                  "
                >
                  Submitted Details
                </h3>

                <p
                  style="
                    margin: 8px 0;
                    color: #555555;
                    font-size: 14px;
                  "
                >
                  <strong>Name:</strong>
                  ${contact.name}
                </p>

                <p
                  style="
                    margin: 8px 0;
                    color: #555555;
                    font-size: 14px;
                  "
                >
                  <strong>Email:</strong>
                  ${contact.email}
                </p>

                <p
                  style="
                    margin: 8px 0;
                    color: #555555;
                    font-size: 14px;
                  "
                >
                  <strong>Phone:</strong>
                  ${contact.phone}
                </p>

              </div>

              <p
                style="
                  margin-top: 30px;
                  color: #555555;
                  font-size: 14px;
                  line-height: 1.7;
                "
              >
                If you need to provide additional information,
                simply reply to this email.
              </p>

            </div>

            <!-- Footer -->

            <div
              style="
                padding: 20px 30px;
                background-color: #f8f8f8;
                text-align: center;
              "
            >

              <p
                style="
                  margin: 0;
                  color: #999999;
                  font-size: 12px;
                "
              >
                This is an automated confirmation email from
                Being IBAN Entertainments.
              </p>

            </div>

          </div>

        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendContactEmail;
