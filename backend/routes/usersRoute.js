const router = require("express").Router();
const {
  getAllUsersCtrl,
  getUserProfileCtrl,
  updateUserProfileCtrl,
  getUsersCountCtrl,
  profilePhotoUploadCtrl,
  deleteUserProfileCtrl,
} = require("../controllers/usersController");
const {
  verifyTokenandAdmin,
  verifyTokenandOnlyUser,
  verifyToken,
  verifyTokenandAuthorization,
} = require("../middlewares/verifyToken");
const validateObjectId = require('../middlewares/validateObjectid')
const photoUpload = require('../middlewares/photoUpload')

// api/users/profile
router.route("/profile").get(verifyTokenandAdmin, getAllUsersCtrl);

// api/users/profile/:id
router
  .route("/profile/:id")
  .get(validateObjectId, getUserProfileCtrl)
  .put(validateObjectId, verifyTokenandOnlyUser, updateUserProfileCtrl)
  .delete(validateObjectId, verifyTokenandAuthorization, deleteUserProfileCtrl);

// api/users/profile/profile-photo-upload
router
  .route("/profile/profile-photo-upload")
  .post(verifyToken, photoUpload.single("image"), profilePhotoUploadCtrl);

// api/users/count
router.route("/count").get(verifyTokenandAdmin, getUsersCountCtrl);

module.exports = router;
