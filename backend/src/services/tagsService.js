const pool = require("../db");
const logger = require("../utils/logger");
const { NotFoundError, ValidationError, ConflictError } = require("../utils/errors");

async function listTags(userId, pagination = {}) {
    if (pagination === null) {
        const start = Date.now();
        const result = await pool.query(
            `SELECT id, name, created_at
     FROM tags
     WHERE user_id = $1
     ORDER BY name ASC`,
            [userId]
        );
        const duration = Date.now() - start;
        logger.info({ query: "tags.list", durationMs: duration });
        return result.rows;
    }
    const { page = 1, limit = 20 } = pagination;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    if (Number.isNaN(pageNum) || pageNum < 1) {
        throw new ValidationError("page must be >= 1");
    }
    if (Number.isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        throw new ValidationError("limit must be between 1 and 100");
    }
    const offset = (pageNum - 1) * limitNum;

    const start = Date.now();
    const result = await pool.query(
        `SELECT id, name, created_at
     FROM tags
     WHERE user_id = $1
     ORDER BY name ASC
     LIMIT $2 OFFSET $3`,
        [userId, limitNum, offset]
    );
    const data = result.rows;
    const duration = Date.now() - start;
    logger.info({ query: "tags.list", durationMs: duration });

    const countStart = Date.now();
    const countResult = await pool.query(
        `SELECT COUNT(*) FROM tags WHERE user_id = $1`,
        [userId]
    );
    const total = Number(countResult.rows[0].count);
    const countDuration = Date.now() - countStart;
    logger.info({ query: "tags.count", durationMs: countDuration });
    return { data, page: pageNum, limit: limitNum, total };
}

async function createTag(userId, name) {
    if (!name || !String(name).trim()) {
        throw new ValidationError("Tag name is required");
    }

    try {
        const result = await pool.query(
            `INSERT INTO tags (name, user_id)
       VALUES ($1, $2)
       RETURNING id, name, created_at`,
            [String(name).trim(), userId]
        );
        return result.rows[0];
    } catch (err) {
        if (err.code === "23505") {
            throw new ConflictError("Tag name already exists");
        }
        throw err;
    }
}

async function deleteTag(tagId, userId) {
    const result = await pool.query(
        `DELETE FROM tags
     WHERE id = $1 AND user_id = $2
     RETURNING id`,
        [tagId, userId]
    );

    if (result.rows.length === 0) {
        throw new NotFoundError("Tag not found");
    }
}

module.exports = {
    listTags,
    createTag,
    deleteTag,
};