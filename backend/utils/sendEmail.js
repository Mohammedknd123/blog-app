const nodemailer = require("nodemailer");

module.exports = async (userEmail, subject, htmlTemplate) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,

      auth: {
        user: process.env.APP_EMAIL_ADDRESS,
        pass: process.env.APP_EMAIL_PASSWORD,
      },

      tls: {
        rejectUnauthorized: false,
      },

      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 30000,
    });

    const info = await transporter.sendMail({
      from: `"BlogApp" <${process.env.APP_EMAIL_ADDRESS}>`,
      to: userEmail,
      subject: subject,
      html: htmlTemplate,
    });

    console.log("Email sent successfully:", info.messageId);

    return info;
  } catch (error) {
    console.error("Email sending failed:", error);

    throw new Error("Internal server error (nodemailer)");
  }
};
