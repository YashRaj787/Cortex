const pool = require("../db");
const { NotFoundError, ValidationError, ConflictError } = require("../utils/errors");

async function listFolders(userId) {
    const result = await pool.query(
        `SELECT id, name, created_at
     FROM folders
     WHERE user_id = $1
     ORDER BY created_at DESC`,
        [userId]
    );
    return result.rows;
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