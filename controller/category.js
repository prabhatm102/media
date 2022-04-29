const io = require("../index");
const { Category } = require("../model/category");
const { Post } = require("../model/post");
const { User } = require("../model/user");

const getCategoryById = async (req, res, next) => {
  const category = await Category.findOne({
    isDeleted: false,
    _id: req.params.id,
  })
    .populate("user", "name _id file createdAt updatedAt")
    .sort("name")
    .select("-__v -createdAt -updatedAt -isDeleted");

  if (!category)
    return res
      .status(400)
      .send({ message: "There is no category of specified Id." });

  res.status(200).send(category);
};

const getCategories = async (req, res, next) => {
  const categories = await Category.find({
    isDeleted: false,
  })
    .populate("user", "name _id file createdAt updatedAt")
    .sort("name")
    .select("-__v -createdAt -updatedAt -isDeleted");

  res.status(200).send(categories);
};

const addCategory = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(401).send({ message: "You don't have permission" });
  }

  let duplicatecategory = await Category.findOne({
    name: req.body.name?.toLowerCase(),
    isDeleted: false,
  });

  if (duplicatecategory)
    return res
      .status(400)
      .send({ message: "Category name has already been taken." });

  let category = await new Category({
    name: req.body.name?.toLowerCase(),
    user: req.user?._id?.toString(),
  }).save();

  category = await category.populate("user");

  res.status(200).send(category);
};

const updateCategory = async (req, res, next) => {
  let category = await Category.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!category)
    return res
      .status(400)
      .send({ message: "There is no category of specified ID." });

  if (!req.user.isAdmin) {
    return res.status(401).send({ message: "You don't have permission" });
  }

  let duplicatecategory = await Category.findOne({
    name: req.body.name?.toLowerCase(),
    isDeleted: false,
  });

  if (duplicatecategory)
    return res
      .status(400)
      .send({ message: "Category name has already been taken." });

  category = await Category.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { name: req.body.name?.toLowerCase() } },
    { new: true }
  );

  category = await category.populate("user");

  res.status(200).send(category);
};

const deleteCategory = async (req, res, next) => {
  let category = await Category.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!category)
    return res
      .status(400)
      .send({ message: "There is no category of specified ID." });

  if (!req.user.isAdmin) {
    return res.status(401).send({ message: "You don't have permission" });
  }

  await Category.updateOne(
    { _id: req.params.id, isDeleted: false },
    { $set: { isDeleted: true } }
  );

  res.status(200).send({ message: "Category deleted successfully." });
};

module.exports = {
  getCategoryById,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
