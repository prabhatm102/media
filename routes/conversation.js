const express = require("express");
const router = express.Router();
const {
  getConversation,
  addConversation,
  deleteChat,
  updateWallpaper,
} = require("../controller/conversation");
const {
  validate,
  validateWallpaperUpdate,
} = require("../validation/conversation");
const { validateObjectId } = require("../middleware/validate");

const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/posts/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      file.originalname.split(path.extname(file.originalname))[0] +
      "-" +
      Date.now() +
      path.extname(file.originalname) +
      Math.random() * 1e9;

    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

router.get("/:id", [auth, validateObjectId, getConversation]);
router.post("/", auth, validate, addConversation);

router.patch("/:id", [
  upload.single("wallpaper"),
  auth,
  validateWallpaperUpdate,
  validateObjectId,
  updateWallpaper,
]);

router.delete("/:id", [auth, validateObjectId, deleteChat]);

module.exports = router;
