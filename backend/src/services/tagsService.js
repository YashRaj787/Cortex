const pool = require("../db");
const { NotFoundError, ValidationError, ConflictError } = require("../utils/errors");

async function listTags(userId) {
    const result = await pool.query(
        `SELECT id, name, created_at
     FROM tags
     WHERE user_id = $1
     ORDER BY name ASC`,
        [userId]
    );
    return result.rows;
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