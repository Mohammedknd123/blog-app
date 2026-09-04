const asyncHandler = require("express-async-handler");
const { User, validateUpdateUser } = require("../models/User");
const {Post} = require('../models/Post')
const {Comment} = require('../models/Comments')
const bcrypt = require("bcryptjs");
const path = require('path')
const fs = require('fs')
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
  cloudinaryRemoveMultipleImages,
} = require("../utils/cloudinary");

/**
 * @desc Get all users profiles
 * @route /api/users/profile
 * @method GET
 * @access private (only admin)
 */
module.exports.getAllUsersCtrl = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").populate("posts");
  res.status(200).json(users);
});

/**
 * @desc Get user profile
 * @route /api/users/profile/:id
 * @method GET
 * @access public
 */
module.exports.getUserProfileCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password").populate("posts"); // we added populate after we worked with virtual method in User Schema
  if (!user) {
    return res.status(404).json({ message: "User not Found " });
  }
  res.status(200).json(user);
});

/**
 * @desc Update user profiles
 * @route /api/users/profile/:id
 * @method PUT
 * @access private (only user himself)
 */
module.exports.updateUserProfileCtrl = asyncHandler(async (req, res) => {
  // validation
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // hash password
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  // update the user
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        username: req.body.username,
        password: req.body.password,
        bio: req.body.bio,
      },
    },
    { new: true },
  ).select("-password").populate("posts");

  // response to client
  res.status(200).json(updatedUser);
});

/**
 * @desc Get users Count
 * @route /api/users/count
 * @method GET
 * @access private (only admin)
 */
module.exports.getUsersCountCtrl = asyncHandler(async (req, res) => {
  const count = await User.countDocuments();
  res.status(200).json(count);
});


/**
 * @desc Profile Photo Upload
 * @route /api/users/profile/profile-photo-upload
 * @method POST
 * @access private (only logged in user)
 */
module.exports.profilePhotoUploadCtrl = asyncHandler(async (req, res) => {
  // validation
  if (!req.file) {
    return res.status(400).json({message: 'no file provided'})
  }

  // Get the path to the image
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`)

  // Upload to cloudinary
  const resault = await cloudinaryUploadImage(imagePath)
  console.log(resault)

  // update the user from DB
  const user = await User.findById(req.user.id)

  // Delete the old profile photo if exists
  if (user.profilephoto.publicId !== null) {
    await cloudinaryRemoveImage(user.profilephoto.publicId);
  }

  // Change the profile photo field in the DB
  user.profilephoto = {
    url: resault.secure_url,
    publicId: resault.public_id
  }
  await user.save()

  // Send Request to client 
  res.status(200).json({message: "Your Profile Photo Uploaded Succefully",
    profilephoto: {url: resault.secure_url, publicId: resault.public_id}
  })

  // Remove image from server
  fs.unlinkSync(imagePath)
})


/**
 * @desc Delete User Profile (Account)
 * @route /api/users/profile/:id
 * @method DELETE
 * @access private (only admin or user himself)
 */
module.exports.deleteUserProfileCtrl = asyncHandler(async (req, res) => {
  // Get the User from DB 
  const user = await User.findById(req.params.id)
  if (!user) {
    res.status(404).json({message: "User not found"})
  }

  // Get all Posts from DB
  const posts = await Post.find({user: user._id})

  // Get the public ids from the posts
  const publicIds = posts?.map((post) => post.image.publicId)

  // Delete all posts images from cloudinary that belong to this User\
  if (publicIds?.length > 0) {
    cloudinaryRemoveMultipleImages(publicIds)
  }

  // Delete Profile picture from cloudinary 
  if (user.profilephoto.publicId !== null) {
    await cloudinaryRemoveImage(user.profilephoto.publicId);
  }
  

  // Delete user Posts & comments
  await Post.deleteMany({user: user._id})
  await Comment.deleteMany({ user: user._id });

  // Delete the user himself
  await User.findByIdAndDelete(req.params.id)

  // Send a response to the client 
  res.status(200).json({message: "User has been deleted succefully"})


})