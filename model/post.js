const mongoose = require("mongoose");

const post = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },

    postFile: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    comments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "comments", default: {} },
    ],
    likes: [
      { type: mongoose.Schema.Types.ObjectId, ref: "users", default: {} },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("posts", post);

module.exports.Post = Post;
