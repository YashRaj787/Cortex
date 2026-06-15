const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  listTags,
  createTag,
  deleteTag,
} = require("../controllers/tagsController");

const { createTagSchema } = require("../validators/tagValidator");
const { validate } = require("../middleware/validationMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", listTags);
router.post("/", validate(createTagSchema), createTag);
router.delete("/:id", deleteTag);

module.exports = router;
