const io = require("../index");
const { User } = require("../model/user");
const { Post } = require("../model/post");
const { Comment } = require("../model/comment");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const winston = require("winston");

const getUserById = async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id, isDeleted: false })
    .populate("friends.user")
    .select("name file friends");
  res.status(200).send(user);
};

const getUsers = async (req, res, next) => {
  let query = { isDeleted: false };
  let { searchQuery, userType, userStatus } = req.query;

  if (searchQuery) {
    query.$or = [
      {
        name: {
          $regex: searchQuery,
          $options: "^si$",
        },
      },
      {
        email: {
          $regex: searchQuery,
          $options: "^si$",
        },
      },
    ];
  }

  if (req.query.hasOwnProperty("userType")) query.isAdmin = userType === "true";
  if (req.query.hasOwnProperty("userStatus"))
    query.isActive = userStatus === "true";

  const users = await User.find(query).populate("friends.user").select(" -__v");
  res.status(200).send(users);
};

const addUser = async (req, res, next) => {
  const email = await User.findOne({ email: req.body.email, isDeleted: false });
  if (email) {
    try {
      fs.unlinkSync(
        path.join(__dirname, "../public/uploads/") + req.file.filename
      );
    } catch (ex) {}
    return res.status(409).send({ message: "Email Already Exists!" });
  }
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    file: req.file.filename,
  });
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);
  user.password = hashedPass;

  await user.save();
  const token = user.genrateToken();

  res
    .status(200)
    .header("access-control-expose-headers", "x-auth-token")
    .header("x-auth-token", token)
    .send({ token: token, status: 200 });
};
const isEmailExists = async (req, res, next) => {
  const email = await User.findOne({ email: req.body.email, isDeleted: false });
  if (email) {
    return res.status(409).send({ message: "Email Already Exists!" });
  }

  res.status(200).send({ message: "Valid Email", status: 200 });
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false });
    if (!user || (!req.user.isAdmin && req.params.id !== req.user._id))
      throw new Error("Bad request!");

    if (!req.user.isAdmin && (req.body.isAdmin || req.body.isActive))
      return res.status(401).send({ message: "You dont have permission." });

    const updateData = {
      name: req.body.name,
      email: req.body.email,
      isActive: req.body.isActive,
      isAdmin: req.body.isAdmin,
    };

    if (req.file) updateData.file = req.file.filename;

    let result = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      {
        $set: updateData,
      },
      { new: true }
    );

    if (req.file) {
      try {
        fs.unlinkSync(path.join(__dirname, "../public/uploads/") + user.file);
      } catch (ex) {
        winston.info("Image has already been deleted!");
      }
    }

    if (req.user.isAdmin && req.params.id !== req.user._id) {
      return res.status(200).send(result);
    }
    const token = result.genrateToken();
    result = await result.populate("friends.user");

    res
      .status(200)
      .header("access-control-expose-headers", "x-auth-token")
      .header("x-auth-token", token)
      .send(result);
  } catch (ex) {
    try {
      fs.unlinkSync(
        path.join(__dirname, "../public/uploads/") + req.file.filename
      );
    } catch (ex) {}
    return res.status(401).send({ message: ex.message });
  }
};
const getFriends = async (req, res) => {
  const allFriends = await User.findOne({
    _id: req.params.id,
    isDeleted: false,
  })
    .populate({ path: "friends.user", select: "_id name file" })
    .select("-_id friends");

  res.status(200).send(allFriends.friends);
};
const addFriend = async (req, res, next) => {
  let user = await User.findOne({ _id: req.body.friend, isDeleted: false });

  if (!user)
    return res.status(400).send({ message: "There is no friend of given id!" });

  let sender = await User.findOne({
    _id: req.user._id.toString(),
    isDeleted: false,
  });
  if (!sender) return res.status(400).send({ message: "Invalid sender" });

  const friend = sender.friends.find(
    (f) => f?.user?.toString() === req.body.friend
  );

  if (friend) {
    if (friend.status === "pending") {
      const friendList = sender.friends.filter(
        (f) => f?.user?.toString() !== req.body.friend.toString()
      );
      friend.status = "success";
      friendList.push(friend);

      sender.friends = friendList;
      const userFriendList = user.friends.filter(
        (f) => f.user.toString() !== sender._id.toString()
      );
      userFriendList.push({ user: sender._id, status: "success" });
      user.friends = userFriendList;
      user = await user.save();
      sender = await sender.save();
      user = await user.populate({
        path: "friends.user",
        select: "_id name file",
      });

      sender = await sender.populate({
        path: "friends.user",
        select: "_id name file",
      });
      // .select("-_id friends");

      // io.to(user._id.toString()).emit("friendRequest", friendList);
      io.to(user._id.toString()).emit("friendRequest", sender);
      return res.status(200).send(user);
    }
  }
  if (!friend) {
    try {
      sender.friends.push({ user: req.body.friend, status: "sent" });

      user.friends.push({ user: sender._id, status: "pending" });

      user = await user.save();
      sender = await sender.save();

      user = await user.populate({
        path: "friends.user",
        select: "_id name file",
      });
      sender = await sender.populate({
        path: "friends.user",
        select: "_id name file",
      });
      // .select("-_id friends");
      // io.to(user._id.toString()).emit("friendRequest", {
      //   user: req.body.friend,
      //   status: "sent",
      // });
      io.to(user._id.toString()).emit("friendRequest", sender);

      return res.status(200).send(user);
    } catch (ex) {
      return res.status(400).send({ message: ex.message });
    }
  }
  res.status(400).send({ message: "Friend Already Available" });
};

const cancelRequest = async (req, res, next) => {
  let user = await User.findOne({ _id: req.body.friend, isDeleted: false });
  if (!user)
    return res.status(400).send({ message: "There is no friend of given id!" });

  let sender = await User.findOne({ _id: req.user._id, isDeleted: false });
  if (!sender) return res.status(400).send({ message: "Invalid sender" });

  const friend = sender.friends.find(
    (f) => f.user.toString() === req.body.friend.toString()
  );

  try {
    if (friend) {
      const friendList = sender.friends.filter(
        (f) => f.user.toString() !== user._id.toString()
      );

      sender.friends = friendList;
      const userFriendList = user.friends.filter(
        (f) => f.user.toString() !== sender._id.toString()
      );
      user.friends = userFriendList;
      user = await user.save();

      sender = await sender.save();
      user = await user.populate({
        path: "friends.user",
        select: "_id name file",
      });
      sender = await sender.populate({
        path: "friends.user",
        select: "_id name file",
      });
      // .select("-_id friends");
      // io.to(user._id.toString()).emit("cancelRequest", { userFriendList });
      io.to(user._id.toString()).emit("cancelRequest", sender);

      return res.status(200).send(user);
    } else {
      return res.status(400).send({ message: "Bad Request" });
    }
  } catch (ex) {
    console.log(ex);
    return res.status(400).send({ message: "Bad Request" });
  }
};
const updatePass = async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.authToken, config.get("jwtPrivateKey"));

    const user = await User.findOne({ email: decoded.email, isDeleted: false });
    if (!user) throw new Error("Unauthorised!");

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.cnfPass, salt);
    user.password = hashedPass;

    await user.save();

    res.cookie("verify=;path='/';expires=" + new Date("01/01/1900"));

    //Send Mail for acknowledgement

    const link = req.get("origin") + "/signin";
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "dummyrudra@gmail.com",
        pass: config.get("mailPass"),
      },
    });
    var mailOptions = {
      from: "dummyrudra@gmail.com",
      to: user.email,
      subject: "Security Updated",
      html:
        "<h2>Your password has been updated successfully!</h2><br><a href=" +
        link +
        ">SignIn to continue</a>",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error)
        res.status(500).send({ message: "Something Went wrong!Try again" });
      else
        res.status(200).send({
          message:
            "Your Password has successfully updated ! Login To Continue!",
        });
    });
  } catch (ex) {
    res.cookie("authToken=;" + "path='/';expires=" + new Date("01/01/1900"));
    return res.status(401).send({ message: "Unauthorised" });
  }
};

const deleteUser = async (req, res, next) => {
  const user = await User.findOne({
    _id: req.params.id,
    isAdmin: false,
    isDeleted: false,
  });

  if (!user)
    return res
      .status(400)
      .send({ message: "There is no user of specified id" });

  if (req.params.id === req.user._id.toString())
    return res.status(401).send({ message: "You cannot delete yourself!" });

  await User.updateOne(
    { _id: user._id.toString(), isDeleted: false },
    { $set: { isDeleted: true, friends: [] } }
  );

  await User.updateMany(
    { friends: { $elemMatch: { user: user._id.toString() } } },
    {
      $pull: { friends: { user: user._id.toString() } },
    }
  );

  await Post.updateMany(
    { user: user._id.toString() },
    { $set: { isDeleted: true } }
  );
  await Comment.updateMany(
    { user: user._id.toString() },
    { $set: { isDeleted: true } }
  );
  // try {
  //   fs.unlinkSync(path.join(__dirname, "../public/uploads/") + user.file);
  // } catch (ex) {
  //   winston.info("User image has already been deleted!");
  // }
  // const decoded = jwt.verify(
  //   req.cookies.authToken,
  //   config.get("jwtPrivateKey")
  // );
  // if (decoded.isAdmin) {
  //   return res.status(200).send("/dashboard");
  // }
  res.status(200).send({ message: "User deleted successfully." });
};

const sendMail = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email, isDeleted: false });
  if (!user) return res.status(401).send({ message: "Invalid Email!" });

  const token = user.genrateToken();

  const d = new Date();
  d.setTime(d.getTime() + 1000 * 60 * 10);
  // console.log(d.toLocaleTimeString());
  const expDate = d.toUTCString();

  const link = req.get("origin") + "/changepassword/" + token;

  res.cookie("verify=" + token + ";expires=" + expDate);

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "dummyrudra@gmail.com",
      pass: config.get("mailPass"),
    },
  });
  var mailOptions = {
    from: "dummyrudra@gmail.com",
    to: user.email,
    subject: "Verify your email",
    html:
      "<h2>Click on the below link to reset password</h2><br><a href=" +
      link +
      ">Forget Password</a>",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error)
      res.status(500).send({ message: "Something Went wrong!Try again" });
    else
      res
        .status(200)
        .send({ message: "Please check your mail to reset password" });
  });
};

module.exports = {
  getUserById,
  getUsers,
  addUser,
  addFriend,
  cancelRequest,
  getFriends,
  updateUser,
  updatePass,
  deleteUser,
  sendMail,
  isEmailExists,
};
