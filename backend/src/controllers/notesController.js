const notesService = require("../services/notesService");

/**
 * Thin controller layer — delegates all business logic to notesService.
 * Catches errors and forwards to the global error middleware via next().
 */

const listNotes = async (req, res, next) => {
  try {
  const { page, limit } = req.query;
  const data = page || limit
    ? await notesService.listNotes(req.user.id, req.query)
    : await notesService.listNotes(req.user.id, null);
  res.json({ message: "Notes retrieved", data });
  } catch (err) {
    next(err);
  }
};

const getNote = async (req, res, next) => {
  try {
    const data = await notesService.getNote(req.params.id, req.user.id);
    res.json({ message: "Note retrieved", data });
  } catch (err) {
    next(err);
  }
};

const createNote = async (req, res, next) => {
  try {
    const data = await notesService.createNote(req.user.id, req.body);
    res.status(201).json({ message: "Note created", data });
  } catch (err) {
    next(err);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const data = await notesService.updateNote(req.params.id, req.user.id, req.body);
    res.json({ message: "Note updated", data });
  } catch (err) {
    next(err);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    await notesService.deleteNote(req.params.id, req.user.id);
    res.json({ message: "Note deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
};
