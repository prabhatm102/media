const mongoose = require("mongoose");

const conversation = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    senderWallpaper: {
      type: String,
      default: "",
    },
    receiverWallpaper: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model("conversations", conversation);

module.exports.Conversation = Conversation;
