// DIAGNOSTIC: Request counting
let getNotesCount = 0;

const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { summarizeRateLimiter } = require("../middleware/rateLimiter");
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

// DIAGNOSTIC: Wrapper to count GET / requests
const listNotesCounted = (req, res, next) => {
  console.log(`[DIAG] GET /api/v1/notes #${++getNotesCount} at ${new Date().toISOString()}`);
  return listNotes(req, res, next);
};

router.get("/", listNotesCounted);
router.get("/:id", getNote);
router.post("/", validate(createNoteSchema), createNote);
router.put("/:id", validate(updateNoteSchema), updateNote);
router.delete("/:id", deleteNote);

// AI summarization
router.post("/:id/summarize", summarizeRateLimiter, summarize);

module.exports = router;
