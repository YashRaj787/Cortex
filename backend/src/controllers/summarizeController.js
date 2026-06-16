const pool = require("../db");
const { summarizeNote } = require("../services/summarizeService");
const { NotFoundError, ValidationError } = require("../utils/errors");

/**
 * POST /api/v1/notes/:id/summarize
 * Generates an AI summary for the specified note.
 */
const summarize = async (req, res, next) => {
  const logger = require("../utils/logger");
  try {
    const { id } = req.params;
    logger.info({msg: "AI summarization request", noteId: id});

        // Fetch the note, ensuring it belongs to the authenticated user
        const result = await pool.query(
            `SELECT id, title, content
       FROM notes
       WHERE id = $1 AND user_id = $2`,
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            throw new NotFoundError("Note not found");
        }

        const note = result.rows[0];

        if (!note.content || !note.content.trim()) {
            throw new ValidationError("Note has no content to summarize");
        }

    const summary = await summarizeNote(note.title, note.content);
    logger.info({msg: "AI summarization success", noteId: id});

        res.json({
            message: "Summary generated",
            data: { summary },
        });
    } catch (err) {
    logger.error({msg: "AI summarization failed", err});
        next(err);
    }
};

module.exports = { summarize };