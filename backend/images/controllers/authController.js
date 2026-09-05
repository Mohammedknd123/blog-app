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

  // making the link
  const link = `${process.env.CLIENT_DOMAIN}/users/${user._id}/verify/${verificationToken.token}`;

  // puting the link into an html template
  const htmlTemplate = `
  <div>
  <p>Click on the Link bellow to verify your email</p>
  <a href='${link}'>Verify</a>
  </div>
  `;

  // sending emil to the user
  await sendEmail(user.email, "Verify your Email", htmlTemplate);

  // send response to client
  res
    .status(201)
    .json({ message: "We sent you an email, please verify your email box" });
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

    const link = `${process.env.CLIENT_DOMAIN}/users/${user._id}/verify/${verificationToken.token}`;

    const htmlTemplate = `
  <div>
  <p>Click on the Link bellow to verify your email</p>
  <a href='${link}'>Verify</a>
  </div>
  `;

    await sendEmail(user.email, "Verify your Email", htmlTemplate);

    return res
      .status(400)
      .json({ message: "We sent you an email, please verify your email box" });
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
