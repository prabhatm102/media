const io = require("../index");
const { Post } = require("../model/post");
const { Comment } = require("../model/comment");
const { User } = require("../model/user");
const fs = require("fs");
const path = require("path");
const winston = require("winston");

function deleteFiles(files) {
  if (files.length > 0) {
    try {
      req.files.forEach((path) => fs.existsSync(path) && fs.unlinkSync(path));
      return;
    } catch (err) {
      return;
    }
  }
}

const getPostById = async (req, res, next) => {
  const posts = await Post.findOne({
    _id: req.params.id,
    isDeleted: false,
  })
    .populate("user", "name _id file createdAt updatedAt")
    .populate({
      path: "comments",
      populate: { path: "user", select: "name _id file" },
    })
    .populate("likes")
    .sort("-createdAt")
    .select("-__v");

  // const imageUrl =
  //   req.protocol + "://" + path.join(req.headers.host, "/posts/");

  // const allPosts = posts.map((p) => {
  //   p.file = imageUrl + p.file;
  //   return p;
  // });
  res.status(200).send(posts);
};

const getPostsByUserId = async (req, res, next) => {
  const posts = await Post.find({
    user: req.params.id,
    isDeleted: false,
    message: {
      $regex: req.query?.searchQuery || "",
      $options: "^si$",
    },
  })
    .populate("user", "name _id file createdAt updatedAt")
    .populate({
      path: "comments",
      populate: { path: "user", select: "name _id file" },
    })
    .populate("likes")
    .sort("-createdAt")
    .select("-__v");

  // const imageUrl =
  //   req.protocol + "://" + path.join(req.headers.host, "/posts/");

  // const allPosts = posts.map((p) => {
  //   p.file = imageUrl + p.file;
  //   return p;
  // });
  res.status(200).send(posts);
};

const getPosts = async (req, res, next) => {
  const posts = await Post.find({
    isDeleted: false,
    message: {
      $regex: req.query?.searchQuery || "",
      $options: "^si$",
    },
  })
    .populate("user", "name _id file createdAt updatedAt")
    .populate({
      path: "comments",
      populate: { path: "user", select: "name _id file" },
    })
    .populate("likes")
    .sort("-createdAt")
    .select("-__v");

  // const imageUrl =
  //   req.protocol + "://" + path.join(req.headers.host, "/posts/");

  // const allPosts = posts.map((p) => {
  //   p.file = imageUrl + p.file;
  //   return p;
  // });
  res.status(200).send(posts);
};

const addPost = async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id, isDeleted: false });

  if (!user) {
    deleteFiles(req.files);
    return res.status(400).send("There is no user.");
  }

  let post = new Post({
    message: req.body.message,
    user: req.params.id,
  });
  if (req.files.length > 0) {
    post.postFile = req.files.map((file) => file.filename);
  }

  await post.save();

  const posts = await Post.findOne({ _id: post._id, isDeleted: false })
    .populate("user", "name _id file createdAt updatedAt")
    .populate("comments", "_id comment")
    .select(" -__v");

  res.status(200).send(posts);
};

const updatePost = async (req, res, next) => {
  let post = await Post.findOne({ _id: req.params.id, isDeleted: false });
  if (!post) {
    deleteFiles(req.files);
    return res
      .status(400)
      .send({ message: "There is no post of specified ID." });
  }

  if (!req.user.isAdmin && post.user.toString() !== req.user._id.toString()) {
    deleteFiles(req.files);
    return res.status(401).send({ message: "You don't have permission" });
  }

  if (req.body.message || req.body.message === "") {
    post.message = req.body.message;
  }

  if (req.files.length > 0) {
    post.postFile = req.files.map((file) => file.filename);
  }

  post = await post.save();

  const posts = await Post.findOne({ _id: post._id, isDeleted: false })
    .populate("user", "name _id file createdAt updatedAt")
    .populate({
      path: "comments",
      populate: { path: "user", select: "name _id file" },
    })
    .populate("likes")
    .select("-__v");

  res.status(200).send(posts);
};

const deletePost = async (req, res, next) => {
  const post = await Post.findOne({ _id: req.params.id, isDeleted: false });
  if (!post)
    return res
      .status(400)
      .send({ message: "There is no post of specified id" });

  if (!req.user.isAdmin && post.user.toString() !== req.user._id.toString())
    return res.status(401).send({ message: "You don't have permission" });

  await post.comments.map(
    async (comment) =>
      await Comment.updateMany(
        { _id: comment._id, isDeleted: false },
        { $set: { isDeleted: true } }
      )
  );

  await Post.updateOne(
    { _id: post._id, isDeleted: false },
    { $set: { isDeleted: true } }
  );
  // try {
  //   if (post.postFile)
  //     fs.unlinkSync(path.join(__dirname, "../public/posts/") + post.postFile);
  // } catch (ex) {
  //   winston.info("Post image has already been deleted!");
  // }

  res.status(200).send({ message: "Post deleted successfully." });
};

const toggleLike = async (req, res, next) => {
  const user = await User.findOne({ _id: req.user._id, isDeleted: false });
  if (!user)
    return res.status(400).send({ message: "There is no user of given id!" });

  let post = await Post.findOne({ _id: req.body.post, isDeleted: false });

  if (!post) return res.status(400).send({ message: "There is no post." });

  const isLiked = post.likes.find((p) => p.toString() === user._id.toString());

  if (isLiked) {
    const likedList = post.likes.filter(
      (p) => p.toString() !== user._id.toString()
    );

    post.likes = likedList;

    post = await post.save();
    post = await post.populate("likes");
    return res.status(200).send(post);
  }

  try {
    post.likes.push(user._id);

    if (post.user.toString() !== user._id.toString())
      io.to(post.user.toString()).emit("postLiked", {
        post: post,
        likedBy: user,
      });

    post = await post.save();

    post = await post.populate("likes");
    res.status(200).send(post);
  } catch (ex) {
    return res.status(400).send({ message: ex.message });
  }
};

module.exports = {
  getPostById,
  getPostsByUserId,
  getPosts,
  addPost,
  updatePost,
  deletePost,
  toggleLike,
};
