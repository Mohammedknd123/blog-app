const mongoose = require('mongoose')
const Joi = require('joi');
const { text } = require('express');


// Comment Schema
const CommentSchema = mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
}, {timestamps: true}
);

// Comment Model
const Comment = mongoose.model("Comment", CommentSchema) 


// Validate Create Comment 
function validateCreateComment(obj) {
    const schema = Joi.object({
        postId: Joi.string().required(),
        text: Joi.string().trim().required(),
      });
      return schema.validate(obj);
}

// Validate Update Comment 
function validateUpdateComment(obj) {
    const schema = Joi.object({
        text: Joi.string().trim(),
      });
      return schema.validate(obj);
}


module.exports = {
  Comment,
  validateCreateComment,
  validateUpdateComment,
};