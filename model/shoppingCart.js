const mongoose = require("mongoose");

const shoppingCart = new mongoose.Schema(
  {
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        quantity: {
          type: Number,
          default: 0,
          min: 0,
          max: 10000000,
        },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ShoppingCart = mongoose.model("shoppingCart", shoppingCart);

module.exports.ShoppingCart = ShoppingCart;
