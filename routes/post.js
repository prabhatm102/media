const express = require("express");
const router = express.Router();
const {
  getPosts,
  addPost,
  getPostsById,
  deletePost,
  toggleLike,
} = require("../controller/post");
const { validate } = require("../validation/post");
const { validateLike } = require("../validation/likeValidation");
const { validateObjectId } = require("../middleware/validate");

const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/posts/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get("/:id", [getPostsById]);
router.get("/", [getPosts]);

router.post("/toggleLike", [auth, validateLike, toggleLike]);
router.post(
  "/:id",
  upload.single("postFile"),
  auth,
  // validate,
  validateObjectId,
  addPost
);

router.delete("/:id", [auth, deletePost]);

module.exports = router;
