const router = require("express").Router();
const { verifyToken, verifyTokenandAdmin, verifyTokenandAuthorization } = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectid");
const {
  crateCommentCtrl,
  getAllCommentsCtrl,
  deleteCommentCtrl,
  updateCommentCtrl,
} = require("../controllers/commentController");



// /api/comments
router
  .route("/")
  .post(verifyToken, crateCommentCtrl)
  .get(verifyTokenandAdmin, getAllCommentsCtrl)

// /api/comments/:
router
  .route("/:id")
  .delete(validateObjectId, verifyToken, deleteCommentCtrl)
  .put(validateObjectId, verifyToken, updateCommentCtrl);

module.exports = router



