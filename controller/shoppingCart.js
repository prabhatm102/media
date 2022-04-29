const io = require("../index");
const { ShoppingCart } = require("../model/shoppingCart");
const { Product } = require("../model/product");
const { User } = require("../model/user");

const getCartById = async (req, res, next) => {
  const cart = await ShoppingCart.findOne({
    _id: req.params.id,
    isDeleted: false,
  })
    .populate({ path: "items", populate: { path: "product" } })
    .select("-__v -createdAt -updatedAt -isDeleted");

  if (!cart)
    return res
      .status(400)
      .send({ message: "There is no cart of specified Id." });

  cart.items = cart.items.filter((item) => item.quantity > 0);

  res.status(200).send(cart);
};

const getCarts = async (req, res, next) => {
  if (!req.user.isAdmin)
    return res.status(401).send({ message: "You don't have permission.'" });

  const carts = await ShoppingCart.find({
    isDeleted: false,
  })
    .populate({ path: "items", populate: { path: "product" } })
    .sort("-createdAt")
    .select("-__v -createdAt -updatedAt -isDeleted");

  res.status(200).send(carts);
};

const createCart = async (req, res, next) => {
  cart = await new ShoppingCart({
    items: [],
  }).save();
  cart = await cart.populate({ path: "items", populate: { path: "product" } });
  res.status(200).send(cart);
};

const createOrUpdateCart = async (req, res, next) => {
  let product = await Product.findOne({
    _id: req.body.product,
    isDeleted: false,
  });
  if (!product)
    return res.status(400).send({ message: "Product does not exists!" });

  let cart = await ShoppingCart.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (cart) {
    let productIndex = cart.items.findIndex(
      (i) => i?.product?.toString() === req.body.product
    );
    if (productIndex > -1) {
      let quantity = cart.items[productIndex]?.quantity;

      cart.items[productIndex].quantity =
        req.body.action === "add"
          ? (quantity += 1)
          : quantity > 0
          ? (quantity -= 1)
          : 0;
    } else {
      cart.items.push({
        product: req.body.product,
        quantity: 1,
      });
    }
  } else {
    cart = new ShoppingCart({
      items: [{ product: req.body.product, quantity: 1 }],
    });
  }

  cart = await cart.save();
  cart = await cart.populate({ path: "items", populate: { path: "product" } });
  res.status(200).send(cart);
};

module.exports = {
  getCartById,
  getCarts,
  createCart,
  createOrUpdateCart,
};
