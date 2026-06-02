const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  listTags,
  createTag,
  deleteTag,
} = require("../controllers/tagsController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", listTags);
router.post("/", createTag);
router.delete("/:id", deleteTag);

module.exports = router;
