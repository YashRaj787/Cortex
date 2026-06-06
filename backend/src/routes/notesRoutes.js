const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  listNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
} = require("../controllers/notesController");
const { summarize } = require("../controllers/summarizeController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", listNotes);
router.get("/:id", getNote);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

// AI summarization
router.post("/:id/summarize", summarize);

module.exports = router;
