const router = require("express").Router();
const {verifyTokenandAdmin, verifyToken} = require("../middlewares/verifyToken");
const {
  createCategoryCtrl,
  getAllCategoriesCtrl,
  deleteCategoryCtrl,
} = require("../controllers/categoryController");
const validateObjectId = require("../middlewares/validateObjectid");


// /api/categories
router
  .route("/")
  .post(verifyTokenandAdmin, createCategoryCtrl)
  .get(getAllCategoriesCtrl);

// /api/categories/:id 
router.route("/:id").delete(validateObjectId, verifyTokenandAdmin, deleteCategoryCtrl); 
module.exports = router;
