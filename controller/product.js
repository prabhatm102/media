const io = require("../index");
const { Category } = require("../model/category");
const { Product } = require("../model/product");
const { User } = require("../model/user");

const getProductById = async (req, res, next) => {
  const product = await Product.findOne({
    isDeleted: false,
    _id: req.params.id,
  })
    .populate("user", "name _id file createdAt updatedAt")
    .populate("category", "name _id")
    .sort("-createdAt")
    .select("-__v -createdAt -updatedAt -isDeleted");

  if (!product)
    return res
      .status(400)
      .send({ message: "There is no product of specified Id." });

  res.status(200).send(product);
};

const getProducts = async (req, res, next) => {
  const products = await Product.find({
    isDeleted: false,
  })
    .populate("user", "name _id file createdAt updatedAt")
    .populate("category", "name _id")
    .sort("-createdAt")
    .select("-__v -createdAt -updatedAt -isDeleted");

  res.status(200).send(products);
};

const addProduct = async (req, res, next) => {
  if (!req.user.isAdmin) {
    //req.user._id?.toString() !== product.user?.toString();
    return res.status(401).send({ message: "You don't have permission" });
  }

  let duplicateproduct = await Product.findOne({
    title: req.body.title?.toLowerCase(),
    isDeleted: false,
  });

  if (duplicateproduct)
    return res
      .status(400)
      .send({ message: "Product name has already been taken." });

  let category = await Category.findOne({
    _id: req.body.category,
    isDeleted: false,
  });

  if (!category)
    return res.status(400).send({ message: "Category not found." });

  let product = await new Product({
    title: req.body.title?.toLowerCase(),
    price: req.body.price,
    imageUrl: req.body.imageUrl,
    category: req.body.category,
    user: req.user?._id?.toString(),
  }).save();

  res.status(200).send(product);
};

const updateProduct = async (req, res, next) => {
  let product = await Product.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!product)
    return res
      .status(400)
      .send({ message: "There is no product of specified ID." });

  if (!req.user.isAdmin) {
    return res.status(401).send({ message: "You don't have permission" });
  }

  if (req.body.title) {
    let duplicateproduct = await Product.findOne({
      _id: { $ne: req.params.id },
      title: req.body.title?.toLowerCase(),
      isDeleted: false,
    });

    if (duplicateproduct)
      return res
        .status(400)
        .send({ message: "Product title has already been taken." });
  }

  product = await Product.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        title: req.body.title?.toLowerCase(),
        price: req.body.price,
        imageUrl: req.body.imageUrl,
        category: req.body.category,
      },
    },
    { new: true }
  );

  res.status(200).send(product);
};

const deleteProduct = async (req, res, next) => {
  let product = await Product.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!product)
    return res
      .status(400)
      .send({ message: "There is no product of specified ID." });

  if (!req.user.isAdmin) {
    //req.user._id?.toString() !== product.user?.toString();
    return res.status(401).send({ message: "You don't have permission" });
  }

  await Product.updateOne(
    { _id: req.params.id, isDeleted: false },
    { $set: { isDeleted: true } }
  );

  res.status(200).send({ message: "Product deleted successfully." });
};

module.exports = {
  getProductById,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
