const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {
  User,
  validateEmail,
  validateNewPassword
} = require("../models/User");
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
    const {error} = validateEmail(req.body)
    if (error) {
        return res.status(400).json({message: error.details[0].message})
    }

    // get the user from db
    const user = await User.findOne({email: req.body.email})
    if(!user) {
        return res.status(404).json({message: 'User with given email does not exist'})
    }

    // creating verification token 
    let verificationToken = await VerificationToken.findOne({userId : user._id})
    if (!verificationToken) {
        verificationToken = new VerificationToken({
        userId: user._id,
            token: crypto.randomBytes(32).toString('hex')
        })
      await verificationToken.save()
    }

    // creating link
    const link = `${process.env.CLIENT_DOMAIN}/reset-password/${user._id}/${verificationToken.token}`;

    // creating html template
    const htmlTemplate = `<a href='${link}'>Click here to reset you Password</a>`

    // sendin email
    await sendEmail(user.email, 'Reset uour Password', htmlTemplate)

    // sending response to client
    res.status(200).json({
        message: 'Password reset Link was sent to you, please check your email'
    })

})


/**
 * @desc Get reset password link
 * @route /api/password/reset-password/:userId/:token
 * @method GET
 * @access public
 */
module.exports.getResetPasswordLinkCtrl= asyncHandler(async(req,res) => {
    const user = await User.findById(req.params.userId)
    if (!user) {
        return res.status(400).json({message: 'invalid link'})
    }
    const verificationToken = await VerificationToken.findOne({
        userId: user._id,
        token: req.params.token
    })
    if (!verificationToken) {
      return res.status(400).json({ message: "invalid link" });
    }
    res.status(200).json({mesage: 'Valid Url'})
})


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

  const user = await User.findById(req.params.userId)
  if (!user) {
    return res
      .status(404)
      .json({ message: "Invalid link" });
  }

  const verificationToken = await VerificationToken.findOne({
    userId: user._id,
    token: req.params.token
  })
  if (!verificationToken) {
    return res.status(404).json({ message: "Invalid link" });
  }
  if (!user.isAccountVerified) {
    user.isAccountVerified = true
  }
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)

  user.password = hashedPassword
  await user.save()
  await verificationToken.deleteOne();

  res.status(200).json({message: 'Password reset Succefully, Please Login'})
})