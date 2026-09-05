const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const {
  Post,
  validateCreatePost,
  validateUpdatePost,
} = require("../models/Post");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");
const { Comment } = require("../models/Comments");

/**
 * @desc Create new Post
 * @route /api/posts
 * @method POST
 * @access private (only logged in user)
 */
module.exports.creataPostCtrl = asyncHandler(async (req, res) => {
  // Validation for image
  if (!req.file) {
    return res.status(400).json({ message: "No image Provided" });
  }

  // Validation for data
  const { error } = validateCreatePost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Upload photo
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const resault = await cloudinaryUploadImage(imagePath);

  // Create new post and save it to db
  const post = await Post.create({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    user: req.user.id,
    image: {
      url: resault.secure_url,
      publicId: resault.public_id,
    },
  });

  // Send response to client
  res.status(201).json(post);

  // remove image from server
  fs.unlinkSync(imagePath);
});

/**
 * @desc Get all Posts
 * @route /api/posts
 * @method GET
 * @access public
 */
module.exports.getAllPostsCtrl = asyncHandler(async (req, res) => {
  const POST_PER_PAGE = 3;
  const { pageNumber, category } = req.query;
  let posts;
  const categoryPattern = category
    ? new RegExp(`^${category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i")
    : null;
  if (pageNumber) {
    posts = await Post.find()
      .skip((pageNumber - 1) * POST_PER_PAGE)
      .limit(POST_PER_PAGE)
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  } else if (categoryPattern) {
    posts = await Post.find({ category: categoryPattern })
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  } else {
    posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  }
  res.status(200).json(posts);
});

/**
 * @desc Get Single Post
 * @route /api/posts/:id
 * @method GET
 * @access public
 */
module.exports.getSinglePostCtrl = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("user", ["-password"])
    .populate("comments");
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.status(200).json(post);
});

/**
 * @desc Get Posts Count
 * @route /api/posts/count
 * @method GET
 * @access public
 */
module.exports.getPostsCountCtrl = asyncHandler(async (req, res) => {
  const count = await Post.countDocuments();
  res.status(200).json(count);
});

/**
 * @desc Delete a Post
 * @route /api/posts/:id
 * @method DELETE
 * @access private (only admin or user)
 */
module.exports.deletePostCtrl = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  if (req.user.isAdmin || req.user.id === post.user.toString()) {
    await Post.findByIdAndDelete(req.params.id);
    await cloudinaryRemoveImage(post.image.publicId);

    // remove comments of the post
    await Comment.deleteMany({ postId: post._id });

    res.status(200).json({
      message: "Your Post has been deleted Succefully",
      postId: post._id,
    });
  } else {
    res.status(403).json({ message: "access denied , you are not allowed" });
  }
});

/**
 * @desc Update a Post
 * @route /api/posts/:id
 * @method PUT
 * @access private (only user)
 */
module.exports.updatePostCtrl = asyncHandler(async (req, res) => {
  // validation
  const { error } = validateUpdatePost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Get the post from DB and check if it exists
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not Found" });
  }

  // Check if this post belongs to the user
  if (req.user.id !== post.user.toString()) {
    return res
      .status(403)
      .json({ message: "access denied , you are not allowed" });
  }

  // Update Post
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
      },
    },
    { new: true },
  ).populate("user", ["-pawwsord"])
  .populate("comments");

  // Response to Client
  res.status(200).json(updatedPost);
});

/**
 * @desc Update Post image
 * @route /api/posts/update-image/:id
 * @method PUT
 * @access private (only user)
 */
module.exports.updatePostImageCtrl = asyncHandler(async (req, res) => {
  // validation
  if (!req.file) {
    return res.status(400).json({ message: "no image provided" });
  }

  // Get the post from DB and check if it exists
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not Found" });
  }

  // Check if this post belongs to the user
  if (req.user.id !== post.user.toString()) {
    return res
      .status(403)
      .json({ message: "access denied , you are not allowed" });
  }

  // Delete the old Image
  await cloudinaryRemoveImage(post.image.publicId);

  // Upload the new Photo
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const resault = await cloudinaryUploadImage(imagePath);

  // Update image field in the DB
  const updatedPostImage = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        image: {
          url: resault.secure_url,
          publicId: resault.public_id,
        },
      },
    },
    { new: true },
  );

  // Send Response to Client
  res.status(200).json(updatedPostImage);

  // Remove Image froom server
  fs.unlinkSync(imagePath);
});

/**
 * @desc Toggle Like
 * @route /api/posts/like/:id
 * @method PUT
 * @access private (only logged in user)
 */
module.exports.toggleLikeCtrl = asyncHandler(async (req, res) => {
  const loggedInUser = req.user.id;
  const { id: postId } = req.params;
  let post = await Post.findById(postId);

  // check if the post exists
  if (!post) {
    return res.status(400).json({ message: "Post not Found" });
  }
  // check if the user liked the post
  const isPostAlreadyLiked = post.likes.find(
    (user) => user.toString() === loggedInUser,
  );
  if (isPostAlreadyLiked) {
    //here we are checking if the user liked the podt
    post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: {
          likes: loggedInUser, // pull will remove that user who liked the post from likes array
        },
      },
      { new: true },
    );
  } else {
    post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          likes: loggedInUser, // push will add that user who didnt like the post to the likes array
        },
      },
      { new: true },
    );
  }

  res.status(200).json(post);
});
