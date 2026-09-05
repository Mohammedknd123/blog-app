const nodemailer = require("nodemailer");

module.exports = async (userEmail, subject, htmlTemplate) => {
  try {
    // Validate required environment variables
    if (!process.env.APP_EMAIL_ADDRESS || !process.env.APP_EMAIL_PASSWORD) {
      console.error("Missing email credentials in environment variables");
      throw new Error("Email service not configured properly");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.APP_EMAIL_ADDRESS,
        pass: process.env.APP_EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.APP_EMAIL_ADDRESS,
      to: userEmail,
      subject: subject,
      html: htmlTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: " + info.response);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Email sending error:", error.message);
    throw new Error("Failed to send email. Please try again later.");
  }
};
