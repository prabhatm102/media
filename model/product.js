const mongoose = require("mongoose");

const product = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 80,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      max: 10000000,
    },
    imageUrl: {
      type: String,
      required: true,
      minLength: 5,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("product", product);

module.exports.Product = Product;
