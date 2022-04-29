const express = require("express");
const router = express.Router();

const {
  getProductById,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/product");

const auth = require("../middleware/auth");
const { validateObjectId } = require("../middleware/validate");
const {
  validateProduct,
  validateUpdateProduct,
} = require("../validation/product");

router.get("/:id", validateObjectId, getProductById);

router.get("/", getProducts);

router.post("/", auth, validateProduct, addProduct);

router.put(
  "/:id",
  auth,
  validateObjectId,
  validateUpdateProduct,
  updateProduct
);

router.delete("/:id", validateObjectId, auth, deleteProduct);

module.exports = router;
