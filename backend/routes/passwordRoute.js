const router = require('express').Router()
const {
  sendResetPasswordLinkCtrl,
  getResetPasswordLinkCtrl,
  resetPasswordCtrl,
} = require("../controllers/passwoedController");

// /api/password/reset-password
router.route("/reset-password-link").post(sendResetPasswordLinkCtrl);

// /api/password/reset-password/:userId/:token
router
  .route("/reset-password/:userId/:token")
  .get(getResetPasswordLinkCtrl)
  .post(resetPasswordCtrl);


module.exports = router