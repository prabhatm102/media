const express = require("express");
const router = express.Router();

const {
  getCategoryById,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/category");

const auth = require("../middleware/auth");
const { validateObjectId } = require("../middleware/validate");
const { validateCategory } = require("../validation/category");

router.get("/:id", validateObjectId, getCategoryById);

router.get("/", getCategories);

router.post("/", auth, validateCategory, addCategory);

router.put("/:id", auth, validateObjectId, validateCategory, updateCategory);

router.delete("/:id", validateObjectId, auth, deleteCategory);

module.exports = router;
