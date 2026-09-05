const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, validateEmail, validateNewPassword } = require("../models/User");
const { VerificationToken } = require("../models/VerificationToken");
const crypto = require("crypto");
const senEmil = require("../utils/sendEmail");
const sendEmail = require("../utils/sendEmail");

/**
 * @desc Send reset password link
 * @route /api/password/reset-password-link
 * @method POST
 * @access public
 */
module.exports.sendResetPasswordLinkCtrl = asyncHandler(async (req, res) => {
  // validation
  const { error } = validateEmail(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // get the user from db
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(404)
      .json({ message: "User with given email does not exist" });
  }

  // Check if CLIENT_DOMAIN is configured
  if (!process.env.CLIENT_DOMAIN) {
    console.error("CLIENT_DOMAIN environment variable is not set");
    return res
      .status(500)
      .json({ message: "Server configuration error. Please contact support." });
  }

  // creating verification token
  let verificationToken = await VerificationToken.findOne({ userId: user._id });
  if (!verificationToken) {
    verificationToken = new VerificationToken({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    });
    await verificationToken.save();
  }

  // creating link - ensure proper URL formatting
  const clientDomain = process.env.CLIENT_DOMAIN.replace(/\/$/, ""); // Remove trailing slash if present
  const link = `${clientDomain}/reset-password/${user._id}/${verificationToken.token}`;

  // creating html template with better formatting
  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>You have requested to reset your password. Click the link below to proceed:</p>
        <a href='${link}' style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Your Password
        </a>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">
            This link will expire in 24 hours. If you didn't request this, please ignore this email.
        </p>
        <p style="margin-top: 10px; color: #666; font-size: 12px;">
            Or copy and paste this link: ${link}
        </p>
    </div>
    `;

  // sending email
  try {
    await sendEmail(user.email, "Reset Your Password", htmlTemplate);
  } catch (emailError) {
    console.error("Email sending failed:", emailError.message);
    return res
      .status(500)
      .json({ message: "Failed to send email. Please try again later." });
  }

  // sending response to client
  res.status(200).json({
    message:
      "Password reset link has been sent to your email. Please check your inbox and spam folder.",
  });
});

/**
 * @desc Get reset password link
 * @route /api/password/reset-password/:userId/:token
 * @method GET
 * @access public
 */
module.exports.getResetPasswordLinkCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(400).json({ message: "invalid link" });
  }
  const verificationToken = await VerificationToken.findOne({
    userId: user._id,
    token: req.params.token,
  });
  if (!verificationToken) {
    return res.status(400).json({ message: "invalid link" });
  }
  res.status(200).json({ mesage: "Valid Url" });
});

/**
 * @desc Reset password
 * @route /api/password/reset-password/:userId/:token
 * @method POST
 * @access public
 */
module.exports.resetPasswordCtrl = asyncHandler(async (req, res) => {
  const { error } = validateNewPassword(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: "Invalid link" });
  }

  const verificationToken = await VerificationToken.findOne({
    userId: user._id,
    token: req.params.token,
  });
  if (!verificationToken) {
    return res.status(404).json({ message: "Invalid link" });
  }
  if (!user.isAccountVerified) {
    user.isAccountVerified = true;
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  user.password = hashedPassword;
  await user.save();
  await verificationToken.deleteOne();

  res.status(200).json({ message: "Password reset Succefully, Please Login" });
});
