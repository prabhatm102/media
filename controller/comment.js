const { Post } = require("../model/post");
const { User } = require("../model/user");
const { Comment } = require("../model/comment");
const io = require("../index");

const getCommentsByPostId = async (req, res, next) => {
  const posts = await Comment.find({ post: req.params.id, isDeleted: false })
    .populate("user", "name _id file createdAt updatedAt")
    .sort("-createdAt")
    .select("comment createdAt updatedAt");

  // const imageUrl =
  //   req.protocol + "://" + path.join(req.headers.host, "/posts/");

  // const allPosts = posts.map((p) => {
  //   p.file = imageUrl + p.file;
  //   return p;
  // });
  res.status(200).send(posts);
};

// const getComments = async (req, res, next) => {
//   const posts = await Post.find({})
//     .populate("user", "name _id file createdAt updatedAt")
//     .select(" -__v");

//   const imageUrl =
//     req.protocol + "://" + path.join(req.headers.host, "/posts/");

//   const allPosts = posts.map((p) => {
//     p.file = imageUrl + p.file;
//     return p;
//   });
//   res.status(200).send(allPosts);
// };

const addComment = async (req, res, next) => {
  const user = await User.findOne({ _id: req.body.userId, isDeleted: false });
  if (!user) {
    return res.status(400).send({ message: "There is no user." });
  }
  const post = await Post.findOne({ _id: req.body.postId, isDeleted: false });
  if (!post) {
    return res.status(400).send({ message: "There is no post." });
  }
  let comment = new Comment({
    comment: req.body.comment,
    user: req.body.userId,
    post: req.body.postId,
  });

  comment = await comment.save();

  post.comments.push(comment._id);
  await post.save();

  if (post.user.toString() !== user._id.toString())
    io.to(post.user.toString()).emit("postComment", {
      post: post,
      commentedBy: user,
    });

  updatedPost = await Post.findOne({ _id: post._id, isDeleted: false })
    .populate("user", "name _id file createdAt updatedAt")
    .populate({
      path: "comments",
      populate: { path: "user", select: "name _id file" },
    })
    .select(" -__v");

  res.status(200).send(updatedPost);
};

module.exports = {
  getCommentsByPostId,
  //getComments,
  addComment,
  //   updateUser: updateUser,
  //   updatePass: updatePass,
  // deletePost,
};
