const express = require("express");
const router = express.Router();

const {
  getCartById,
  getCarts,
  createCart,
  createOrUpdateCart,
} = require("../controller/shoppingCart");

const auth = require("../middleware/auth");
const { validateObjectId } = require("../middleware/validate");
const { validateUpdateShoppingCart } = require("../validation/shoppingCart");

router.get("/:id", validateObjectId, getCartById);

router.get("/", auth, getCarts);

router.post("/", createCart);

router.put(
  "/:id",
  validateObjectId,
  validateUpdateShoppingCart,
  createOrUpdateCart
);

// router.delete("/:id", validateObjectId, auth, deleteProduct);

module.exports = router;
