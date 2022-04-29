const jwt = require("jsonwebtoken");
const config = require("config");
const { User } = require("../model/user");

module.exports = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res
      .status(401)
      .send({ message: "Access Denied! No Token Provided" });
  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    let user = await User.findOne({ _id: decoded._id, isDeleted: false });
    if (!user) return res.status(401).send({ message: "User Not Found!" });
    req.user = decoded;

    next();
  } catch (ex) {
    res.status(401).send({message:"Invalid Token"});
  }
};
