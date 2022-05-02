const { Conversation } = require("../model/conversation");
const { User } = require("../model/user");
const { Message } = require("../model/message");
const io = require("../index");

const getConversation = async (req, res, next) => {
  const conversation = await Conversation.findOne({
    $and: [
      { isDeleted: false },
      {
        $or: [
          {
            sender: req.user._id,
            receiver: req.params.id,
          },
          {
            sender: req.params.id,
            receiver: req.user._id,
          },
        ],
      },
    ],
  }).select(" -__v");
  let chats;
  if (conversation)
    // chats = await Message.find({ conversation: conversation._id })
    //   .populate("sender", "name _id file ")
    //   .populate({
    //     path: "conversation",
    //     populate: { path: "receiver", select: "name _id file" },
    //   });
    chats = await Message.find({
      conversation: conversation._id.toString(),
      isDeleted: false,
    })
      .populate("sender", "name _id file ")
      .populate("conversation")
      .select("-__v -isDeleted");
  else chats = [];
  res.status(200).send(chats);
};

// const getConversation = async (req, res, next) => {
//   const posts = await Post.find({})
//     .populate("user", "name _id file createdAt updatedAt")
//     .populate({
//       path: "comments",
//       populate: { path: "user", select: "name _id file" },
//     })
//     .select(" -__v");

//   const imageUrl =
//     req.protocol + "://" + path.join(req.headers.host, "/posts/");

//   const allPosts = posts.map((p) => {
//     p.file = imageUrl + p.file;
//     return p;
//   });
//   res.status(200).send(allPosts);
// };

isFriend = (sender, receiver) => {
  if (
    sender?.friends?.find(
      (f) =>
        f?.user?.toString() === receiver?._id?.toString() &&
        f?.status === "success"
    )
  )
    return true;
  else return false;
};

const addConversation = async (req, res, next) => {
  const sender = await User.findOne({ _id: req.user._id, isDeleted: false });
  if (!sender) {
    return res.status(400).send({ message: "There is no sender." });
  }
  const receiver = await User.findOne({
    _id: req.body.receiver,
    isDeleted: false,
  });

  if (!isFriend(sender, receiver))
    return res
      .status(400)
      .send({ message: "You are not a friend of this user." });

  if (!receiver || sender.email === receiver.email) {
    return res.status(400).send({ message: "There is no receiver." });
  }

  //   if(sender.friends.indexOf(receiver)===-1){
  //     return res.status(401).send("You are not friend of this receiver.");
  //   }
  let conversation = await Conversation.findOne({
    $and: [
      { isDeleted: false },
      {
        $or: [
          {
            sender: req.user._id,
            receiver: req.body.receiver,
          },
          {
            sender: req.body.receiver,
            receiver: req.user._id,
          },
        ],
      },
    ],
  }).select(" -__v");

  if (!conversation) {
    conversation = new Conversation({
      sender: req.user._id,
      receiver: req.body.receiver,
    });
    conversation = await conversation.save();
  }

  let message = new Message({
    sender: req.user._id,
    message: req.body.message,
    conversation: conversation._id,
  });

  message = await message.save();

  const messages = await Message.find({
    conversation: conversation._id,
    isDeleted: false,
  })
    // .populate("sender", "name _id file email")
    // .populate({
    //   path: "conversation",
    //   populate: { path: "receiver", select: "name _id file email" },
    // })
    // .select(" -__v");
    .populate("sender", "name _id file ")
    .populate("conversation")
    .select("-__v -isDeleted");
  io.to(req.body.receiver).emit(
    "receiveMessage",
    messages[messages.length - 1]
  );
  res.status(200).send(messages[messages.length - 1]);
};

const updateWallpaper = async (req, res, next) => {
  const sender = await User.findOne({ _id: req.user._id, isDeleted: false });
  if (!sender) {
    return res.status(400).send({ message: "There is no sender." });
  }
  const receiver = await User.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!isFriend(sender, receiver))
    return res
      .status(400)
      .send({ message: "You are not a friend of this user." });

  let conversation = await Conversation.findOne({
    $and: [
      { isDeleted: false },
      {
        $or: [
          {
            sender: req.user._id,
            receiver: req.params.id,
          },
          {
            sender: req.params.id,
            receiver: req.user._id,
          },
        ],
      },
    ],
  }).select(" -__v");

  if (!conversation) {
    conversation = new Conversation({
      sender: req.user._id,
      receiver: req.params.id,
    });
    conversation = await conversation.save();
  }

  conversation?.sender?.toString() === req.user?._id?.toString()
    ? (conversation.senderWallpapaer = req.file?.filename)
    : (conversation.receiverWallpapaer = req.file?.filename);

  conversation = await conversation.save();

  res.status(200).send(conversation);
};

const deleteChat = async (req, res, next) => {
  const conversation = await Message.findOne({
    conversation: req.params.id,
    isDeleted: false,
  });
  if (!conversation) {
    const message = await Message.findOne({
      _id: req.params.id,
      isDeleted: false,
    });
    if (!message)
      return res.status(400).send({ message: "There is no messages." });

    await Message.updateOne(
      { _id: req.params.id },
      { $set: { isDeleted: true } }
    );

    res.status(200).send({ message: "Message successfully deleted ." });
  }

  await Message.updateMany(
    { conversation: req.params.id },
    { $set: { isDeleted: true } }
  );

  res.status(200).send({ message: "Chat Cleared successfully." });
};

module.exports = {
  getConversation,
  addConversation,
  updateWallpaper,
  //   updatePass: updatePass,
  deleteChat,
};
