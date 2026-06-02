const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  listFolders,
  createFolder,
  updateFolder,
  deleteFolder,
} = require("../controllers/foldersController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", listFolders);
router.post("/", createFolder);
router.put("/:id", updateFolder);
router.delete("/:id", deleteFolder);

module.exports = router;
