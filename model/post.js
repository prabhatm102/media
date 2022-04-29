const mongoose = require("mongoose");

const post = new mongoose.Schema(
  {
    message: {
      type: String,
      trim: true,
      default: "",
    },

    postFile: [
      {
        type: String,
        default: "",
      },
    ],
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("posts", post);

module.exports.Post = Post;
