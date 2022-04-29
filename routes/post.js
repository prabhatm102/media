const express = require("express");
const router = express.Router();
const {
  getPosts,
  addPost,
  getPostById,
  getPostsByUserId,
  updatePost,
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

router.get("/:id", [validateObjectId, getPostById]);

router.get("/user/:id", [auth, validateObjectId, getPostsByUserId]);

router.get("/", [getPosts]);

router.post("/toggleLike", [auth, validateLike, toggleLike]);
router.post(
  "/:id",
  upload.array("postFile", 10),
  auth,
  validate,
  validateObjectId,
  addPost
);

router.put(
  "/:id",
  upload.array("postFile", 10),
  auth,
  validate,
  validateObjectId,
  updatePost
);

router.delete("/:id", [auth, validateObjectId, deletePost]);

module.exports = router;
