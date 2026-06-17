const pool = require("../db");
const { summarizeNote } = require("../services/summarizeService");
const { NotFoundError, ValidationError } = require("../utils/errors");

/**
 * POST /api/v1/notes/:id/summarize
 * Generates an AI summary for the specified note.
 */
const summarize = async (req, res, next) => {
  const logger = require("../utils/logger");
  const startTime = Date.now();
  try {
    const { id } = req.params;
    const userId = req.user.id;
    logger.info({msg: "AI summarization request", noteId: id, userId});

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
        // Content size validation
        const totalLength = (note.title?.length ?? 0) + (note.content?.length ?? 0);
        if (totalLength > 20000) {
            const err = new Error("Note exceeds AI processing limit");
            err.statusCode = 400;
            throw err;
        }

        if (!note.content || !note.content.trim()) {
            throw new ValidationError("Note has no content to summarize");
        }

        const summary = await summarizeNote(note.title, note.content);
        const durationMs = Date.now() - startTime;
        logger.info({
            msg: "AI summarization success",
            noteId: id,
            userId,
            contentLength: note.content?.length ?? 0,
            success: true,
            durationMs,
        });

        res.json({
            message: "Summary generated",
            data: { summary },
        });
    } catch (err) {
    const durationMs = Date.now() - startTime;
    logger.error({
        msg: "AI summarization failed",
        noteId: id,
        userId,
        contentLength: note?.content?.length ?? 0,
        success: false,
        durationMs,
        err,
    });
    if (err.statusCode === 504) {
        res.status(504).json({ message: "AI request timed out" });
    } else {
        next(err);
    }
    }
};

module.exports = { summarize };