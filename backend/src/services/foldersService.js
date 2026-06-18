const pool = require("../db");
const logger = require("../utils/logger");
const { NotFoundError, ValidationError, ConflictError } = require("../utils/errors");

async function listFolders(userId, pagination = {}) {
    if (pagination === null) {
        const start = Date.now();
        const result = await pool.query(
            `SELECT id, name, created_at
     FROM folders
     WHERE user_id = $1
     ORDER BY created_at DESC`,
            [userId]
        );
        const duration = Date.now() - start;
        logger.info({ query: "folders.list", durationMs: duration });
        return result.rows;
    }
    const { page = 1, limit = 20 } = pagination;
    // Validate pagination
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
     FROM folders
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
        [userId, limitNum, offset]
    );
    const data = result.rows;
    const duration = Date.now() - start;
    logger.info({ query: "folders.list", durationMs: duration });

    const countStart = Date.now();
    const countResult = await pool.query(
        `SELECT COUNT(*) FROM folders WHERE user_id = $1`,
        [userId]
    );
    const total = Number(countResult.rows[0].count);
    const countDuration = Date.now() - countStart;
    logger.info({ query: "folders.count", durationMs: countDuration });
    return { data, page: pageNum, limit: limitNum, total };
}

async function createFolder(userId, name) {
    if (!name || !String(name).trim()) {
        throw new ValidationError("Folder name is required");
    }

    try {
        const result = await pool.query(
            `INSERT INTO folders (name, user_id)
       VALUES ($1, $2)
       RETURNING id, name, created_at`,
            [String(name).trim(), userId]
        );
        return result.rows[0];
    } catch (err) {
        if (err.code === "23505") {
            throw new ConflictError("Folder name already exists");
        }
        throw err;
    }
}

async function updateFolder(folderId, userId, name) {
    if (!name || !String(name).trim()) {
        throw new ValidationError("Folder name is required");
    }

    try {
        const result = await pool.query(
            `UPDATE folders
       SET name = $1
       WHERE id = $2 AND user_id = $3
       RETURNING id, name, created_at`,
            [String(name).trim(), folderId, userId]
        );

        if (result.rows.length === 0) {
            throw new NotFoundError("Folder not found");
        }

        return result.rows[0];
    } catch (err) {
        if (err.code === "23505") {
            throw new ConflictError("Folder name already exists");
        }
        throw err;
    }
}

async function deleteFolder(folderId, userId) {
    const result = await pool.query(
        `DELETE FROM folders
     WHERE id = $1 AND user_id = $2
     RETURNING id`,
        [folderId, userId]
    );

    if (result.rows.length === 0) {
        throw new NotFoundError("Folder not found");
    }
}

module.exports = {
    listFolders,
    createFolder,
    updateFolder,
    deleteFolder,
};