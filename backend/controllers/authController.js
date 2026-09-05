const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {
  User,
  validateRegisterUser,
  validateLoginUser,
} = require("../models/User");
const { VerificationToken } = require("../models/VerificationToken");
const crypto = require("crypto");
const senEmil = require("../utils/sendEmail");
const sendEmail = require("../utils/sendEmail");

/**
 * @desc Register new user
 * @route /api/auth/register
 * @methos POST
 * @access public
 */
module.exports.registerUserCtrl = asyncHandler(async (req, res) => {
  // validation
  const { error } = validateRegisterUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // does user exist
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ message: "User is already exist" });
  }

  // hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // new user and save to db
  user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });
  await user.save();

  // Creating new verification token and save to db
  const verificationToken = new VerificationToken({
    userId: user._id,
    token: crypto.randomBytes(32).toString("hex"),
  });
  await verificationToken.save();

  // Check if CLIENT_DOMAIN is configured
  if (!process.env.CLIENT_DOMAIN) {
    console.error("CLIENT_DOMAIN environment variable is not set");
    return res
      .status(500)
      .json({ message: "Server configuration error. Please contact support." });
  }

  // making the link
  const clientDomain = process.env.CLIENT_DOMAIN.replace(/\/$/, ""); // Remove trailing slash if present
  const link = `${clientDomain}/users/${user._id}/verify/${verificationToken.token}`;

  // puting the link into an html template
  const htmlTemplate = `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>Welcome to Our Blog!</h2>
    <p>Thank you for creating an account. Please verify your email by clicking the link below:</p>
    <a href='${link}' style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
      Verify Your Email
    </a>
    <p style="margin-top: 20px; color: #666; font-size: 12px;">
      This link will expire in 24 hours. If you didn't create this account, please ignore this email.
    </p>
    <p style="margin-top: 10px; color: #666; font-size: 12px;">
      Or copy and paste this link: ${link}
    </p>
  </div>
  `;

  // sending email to the user
  try {
    await sendEmail(user.email, "Verify your Email", htmlTemplate);
  } catch (emailError) {
    console.error(
      "Email sending failed during registration:",
      emailError.message,
    );
    // Delete the user if email fails
    await User.findByIdAndDelete(user._id);
    await VerificationToken.deleteOne({ _id: verificationToken._id });
    return res
      .status(500)
      .json({
        message:
          "Failed to send verification email. Please try registering again.",
      });
  }

  // send response to client
  res
    .status(201)
    .json({
      message:
        "Account created! We sent you an email, please verify your email address",
    });
});

/**
 * @desc Login user
 * @route /api/auth/login
 * @methos POST
 * @access public
 */
module.exports.loginUserCtrl = asyncHandler(async (req, res) => {
  //validation
  const { error } = validateLoginUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // does user exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: "invalid email or password" });
  }

  // check the password
  const isPasswordMatch = await bcrypt.compare(
    req.body.password,
    user.password,
  );
  if (!isPasswordMatch) {
    return res.status(400).json({ message: "invalid email or password" });
  }

  // sending email (verify account)
  if (!user.isAccountVerified) {
    let verificationToken = await VerificationToken.findOne({
      userId: user._id,
    });

    if (!verificationToken) {
      verificationToken = new VerificationToken({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      });
      await verificationToken.save();
    }

    // Check if CLIENT_DOMAIN is configured
    if (!process.env.CLIENT_DOMAIN) {
      console.error("CLIENT_DOMAIN environment variable is not set");
      return res
        .status(500)
        .json({
          message: "Server configuration error. Please contact support.",
        });
    }

    const clientDomain = process.env.CLIENT_DOMAIN.replace(/\/$/, "");
    const link = `${clientDomain}/users/${user._id}/verify/${verificationToken.token}`;

    const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Email Verification Required</h2>
      <p>Your account needs email verification. Click the link below to verify:</p>
      <a href='${link}' style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Verify Your Email
      </a>
      <p style="margin-top: 20px; color: #666; font-size: 12px;">
        This link will expire in 24 hours.
      </p>
      <p style="margin-top: 10px; color: #666; font-size: 12px;">
        Or copy and paste this link: ${link}
      </p>
    </div>
    `;

    try {
      await sendEmail(user.email, "Verify your Email", htmlTemplate);
    } catch (emailError) {
      console.error("Email sending failed during login:", emailError.message);
      return res
        .status(500)
        .json({
          message: "Failed to send verification email. Please try again.",
        });
    }

    return res
      .status(400)
      .json({
        message:
          "Your account is not verified. We sent you an email to verify your account",
      });
  }

  // generate token (jwt)
  const token = user.generateAuthToken();

  // response to client
  res.status(200).json({
    _id: user.id,
    isAdmin: user.isAdmin,
    profilephoto: user.profilephoto,
    token,
    username: user.username,
  });
});

/**
 * @desc Verify User account
 * @route /api/auth/:userId/verify/:token
 * @method GET
 * @access public
 */
module.exports.verifyUserAccountCtrl = asyncHandler(async (req, res) => {
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

  user.isAccountVerified = true;
  await user.save();

  await verificationToken.deleteOne();

  res.status(200).json({ message: "Your account is verified" });
});
