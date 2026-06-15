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

const { createNoteSchema, updateNoteSchema } = require("../validators/notesValidator");
const { validate } = require("../middleware/validationMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", listNotes);
router.get("/:id", getNote);
router.post("/", validate(createNoteSchema), createNote);
router.put("/:id", validate(updateNoteSchema), updateNote);
router.delete("/:id", deleteNote);

// AI summarization
router.post("/:id/summarize", summarize);

module.exports = router;
