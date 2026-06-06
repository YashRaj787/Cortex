const pool = require("../db");
const { NotFoundError, ValidationError } = require("../utils/errors");

/**
 * Validate that a folder belongs to the given user.
 */
async function validateFolderOwnership(folderId, userId) {
    const result = await pool.query(
        `SELECT id FROM folders WHERE id = $1 AND user_id = $2`,
        [folderId, userId]
    );
    return result.rows.length > 0;
}

/**
 * Validate that all tag IDs belong to the given user.
 */
async function validateTagIds(tagIds, userId) {
    if (!tagIds || tagIds.length === 0) {
        return true;
    }

    const result = await pool.query(
        `SELECT id FROM tags WHERE user_id = $1 AND id = ANY($2::int[])`,
        [userId, tagIds]
    );

    return result.rows.length === tagIds.length;
}

/**
 * Fetch tags attached to a note.
 */
async function fetchTagsForNote(noteId) {
    const result = await pool.query(
        `SELECT t.id, t.name
     FROM tags t
     INNER JOIN note_tags nt ON nt.tag_id = t.id
     WHERE nt.note_id = $1
     ORDER BY t.name ASC`,
        [noteId]
    );
    return result.rows;
}

/**
 * Insert note_tags rows within a transaction.
 */
async function linkTagsToNote(client, noteId, tagIds) {
    if (!tagIds || tagIds.length === 0) {
        return;
    }

    for (const tagId of tagIds) {
        await client.query(
            `INSERT INTO note_tags (note_id, tag_id) VALUES ($1, $2)`,
            [noteId, tagId]
        );
    }
}

/**
 * Normalize tagIds array: dedupe, parse numbers, filter NaN.
 */
function normalizeTagIds(tagIds) {
    if (!Array.isArray(tagIds)) return [];
    return [...new Set(tagIds.map(Number).filter((n) => !Number.isNaN(n)))];
}

// ---- Public API ----

async function listNotes(userId, { folder_id, q } = {}) {
    let query = `
    SELECT id, title, content, folder_id, created_at, updated_at
    FROM notes
    WHERE user_id = $1
  `;
    const params = [userId];
    let paramIndex = 2;

    if (folder_id !== undefined && folder_id !== "") {
        query += ` AND folder_id = $${paramIndex++}`;
        params.push(folder_id);
    }

    const search = q && String(q).trim();
    if (search) {
        query += ` AND (title ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex += 1;
    }

    query += ` ORDER BY updated_at DESC`;

    const result = await pool.query(query, params);
    return result.rows;
}

async function getNote(noteId, userId) {
    const result = await pool.query(
        `SELECT id, title, content, folder_id, created_at, updated_at
     FROM notes
     WHERE id = $1 AND user_id = $2`,
        [noteId, userId]
    );

    if (result.rows.length === 0) {
        throw new NotFoundError("Note not found");
    }

    const tags = await fetchTagsForNote(noteId);

    return { ...result.rows[0], tags };
}

async function createNote(userId, { title, content, folder_id, tagIds }) {
    if (!title || !String(title).trim()) {
        throw new ValidationError("Title is required");
    }

    if (folder_id != null) {
        const ownsFolder = await validateFolderOwnership(folder_id, userId);
        if (!ownsFolder) {
            throw new ValidationError("Invalid folder");
        }
    }

    const normalizedTagIds = normalizeTagIds(tagIds);

    if (normalizedTagIds.length > 0) {
        const validTags = await validateTagIds(normalizedTagIds, userId);
        if (!validTags) {
            throw new ValidationError("One or more tags are invalid");
        }
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const result = await client.query(
            `INSERT INTO notes (title, content, user_id, folder_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, content, folder_id, created_at, updated_at`,
            [
                String(title).trim(),
                content != null ? String(content) : "",
                userId,
                folder_id ?? null,
            ]
        );

        const note = result.rows[0];

        await linkTagsToNote(client, note.id, normalizedTagIds);

        await client.query("COMMIT");

        const tags = await fetchTagsForNote(note.id);

        return { ...note, tags };
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}

async function updateNote(noteId, userId, { title, content, folder_id, tagIds }) {
    // Verify existence
    const existing = await pool.query(
        `SELECT id FROM notes WHERE id = $1 AND user_id = $2`,
        [noteId, userId]
    );

    if (existing.rows.length === 0) {
        throw new NotFoundError("Note not found");
    }

    if (folder_id !== undefined && folder_id !== null) {
        const ownsFolder = await validateFolderOwnership(folder_id, userId);
        if (!ownsFolder) {
            throw new ValidationError("Invalid folder");
        }
    }

    const normalizedTagIds =
        tagIds !== undefined ? normalizeTagIds(tagIds) : null;

    if (normalizedTagIds && normalizedTagIds.length > 0) {
        const validTags = await validateTagIds(normalizedTagIds, userId);
        if (!validTags) {
            throw new ValidationError("One or more tags are invalid");
        }
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const updates = [];
        const values = [];
        let paramIndex = 1;

        if (title !== undefined) {
            if (!String(title).trim()) {
                throw new ValidationError("Title cannot be empty");
            }
            updates.push(`title = $${paramIndex++}`);
            values.push(String(title).trim());
        }

        if (content !== undefined) {
            updates.push(`content = $${paramIndex++}`);
            values.push(String(content));
        }

        if (folder_id !== undefined) {
            updates.push(`folder_id = $${paramIndex++}`);
            values.push(folder_id);
        }

        updates.push(`updated_at = NOW()`);

        values.push(noteId, userId);

        const result = await client.query(
            `UPDATE notes
       SET ${updates.join(", ")}
       WHERE id = $${paramIndex++} AND user_id = $${paramIndex}
       RETURNING id, title, content, folder_id, created_at, updated_at`,
            values
        );

        const note = result.rows[0];

        if (normalizedTagIds !== null) {
            await client.query(`DELETE FROM note_tags WHERE note_id = $1`, [note.id]);
            await linkTagsToNote(client, note.id, normalizedTagIds);
        }

        await client.query("COMMIT");

        const tags = await fetchTagsForNote(note.id);

        return { ...note, tags };
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}

async function deleteNote(noteId, userId) {
    const result = await pool.query(
        `DELETE FROM notes
     WHERE id = $1 AND user_id = $2
     RETURNING id`,
        [noteId, userId]
    );

    if (result.rows.length === 0) {
        throw new NotFoundError("Note not found");
    }
}

module.exports = {
    listNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote,
};