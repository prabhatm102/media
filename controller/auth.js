const { User } = require("../model/user");
const bcrypt = require("bcrypt");

var invalidCount = 1;

const auth = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email, isDeleted: false });
  if (!user) return res.status(400).send({ message: "User not found!" });

  const isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid)
    return res.status(400).send({ message: "Invalid Email Or Password!" });

  if (!user.isActive)
    return res.status(400).send({ message: "You are disabled from login!" });

  const token = user.genrateToken();

  res
    .status(200)
    .header("access-control-expose-headers", "x-auth-token")
    .header("x-auth-token", token)
    .send({ token: token, status: 200 });
};

const logout = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, isDeleted: false });
  if (!user)
    return res.status(400).send({ message: "Logout first then continue!" });

  res.cookie("authToken=;" + "path='/';expires=" + new Date("01/01/1900"));
  res.status(200).send("/");
};

module.exports = {
  auth: auth,
  logout: logout,
};
