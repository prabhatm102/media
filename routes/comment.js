const express = require("express");
const router = express.Router();
const { addComment, getCommentsByPostId } = require("../controller/comment");
const { validate } = require("../validation/comment");
const auth = require("../middleware/auth");
const { validateObjectId } = require("../middleware/validate");

router.get("/:id", [validateObjectId, getCommentsByPostId]);
// router.get("/", [getComments]);
router.post("/", auth, validate, addComment);

//router.delete("/:id", [auth, deleteComment]);

module.exports = router;
