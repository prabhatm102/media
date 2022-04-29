const express = require("express");
const router = express.Router();
const {
  getUserById,
  getUsers,
  addUser,
  getFriends,
  addFriend,
  cancelRequest,
  updateUser,
  updatePass,
  deleteUser,
  sendMail,
  isEmailExists,
} = require("../controller/user");
const { validate } = require("../validation/user");
const { validateUpdate } = require("../validation/updateUser");
const { validateEmail } = require("../validation/validateEmail");
const { validatePass } = require("../validation/validatePass");
const { validateFriend } = require("../validation/validateFriend");
const { validateObjectId } = require("../middleware/validate");
const auth = require("../middleware/auth");
//const { allowCrossDomain } = require("../middleware/allowCrossDomain");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get("/getFriends/:id", [auth, validateObjectId, getFriends]);
router.get("/:id", auth, validateObjectId, getUserById);
router.get("/", [auth, getUsers]);

router.post("/", upload.single("file"), validate, addUser);
router.post("/sendmail", validateEmail, sendMail);

router.patch("/valid-email", validateEmail, isEmailExists);

router.put("/addFriend", [auth, validateFriend, addFriend]);
router.put("/cancelRequest", [auth, validateFriend, cancelRequest]);

router.put("/changepassword/", [validatePass, auth, updatePass]);
router.put("/:id", [
  upload.single("file"),
  auth,
  validateObjectId,
  validateUpdate,
  updateUser,
]);

router.delete("/:id", [auth, validateObjectId, deleteUser]);

module.exports = router;
