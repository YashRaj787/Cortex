const pool = require("../db");

const validateFolderOwnership = async (folderId, userId) => {
  const result = await pool.query(
    `SELECT id FROM folders WHERE id = $1 AND user_id = $2`,
    [folderId, userId]
  );
  return result.rows.length > 0;
};

const validateTagIds = async (tagIds, userId) => {
  if (!tagIds || tagIds.length === 0) {
    return true;
  }

  const result = await pool.query(
    `SELECT id FROM tags WHERE user_id = $1 AND id = ANY($2::int[])`,
    [userId, tagIds]
  );

  return result.rows.length === tagIds.length;
};

const fetchTagsForNote = async (noteId) => {
  const result = await pool.query(
    `SELECT t.id, t.name
     FROM tags t
     INNER JOIN note_tags nt ON nt.tag_id = t.id
     WHERE nt.note_id = $1
     ORDER BY t.name ASC`,
    [noteId]
  );
  return result.rows;
};

const linkTagsToNote = async (client, noteId, tagIds) => {
  if (!tagIds || tagIds.length === 0) {
    return;
  }

  for (const tagId of tagIds) {
    await client.query(
      `INSERT INTO note_tags (note_id, tag_id) VALUES ($1, $2)`,
      [noteId, tagId]
    );
  }
};

const listNotes = async (req, res) => {
  const { folder_id, q } = req.query;

  try {
    let query = `
      SELECT id, title, content, folder_id, created_at, updated_at
      FROM notes
      WHERE user_id = $1
    `;
    const params = [req.user.id];
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

    res.json({
      message: "Notes retrieved",
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to list notes" });
  }
};

const getNote = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, title, content, folder_id, created_at, updated_at
       FROM notes
       WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Note not found" });
    }

    const tags = await fetchTagsForNote(id);

    res.json({
      message: "Note retrieved",
      data: {
        ...result.rows[0],
        tags,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get note" });
  }
};

const createNote = async (req, res) => {
  const { title, content, folder_id, tagIds } = req.body;

  if (!title || !String(title).trim()) {
    return res.status(400).json({ message: "Title is required" });
  }

  if (folder_id != null) {
    const ownsFolder = await validateFolderOwnership(folder_id, req.user.id);
    if (!ownsFolder) {
      return res.status(400).json({ message: "Invalid folder" });
    }
  }

  const normalizedTagIds = Array.isArray(tagIds)
    ? [...new Set(tagIds.map(Number).filter((n) => !Number.isNaN(n)))]
    : [];

  if (normalizedTagIds.length > 0) {
    const validTags = await validateTagIds(normalizedTagIds, req.user.id);
    if (!validTags) {
      return res.status(400).json({ message: "One or more tags are invalid" });
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
        req.user.id,
        folder_id ?? null,
      ]
    );

    const note = result.rows[0];

    await linkTagsToNote(client, note.id, normalizedTagIds);

    await client.query("COMMIT");

    const tags = await fetchTagsForNote(note.id);

    res.status(201).json({
      message: "Note created",
      data: { ...note, tags },
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: "Failed to create note" });
  } finally {
    client.release();
  }
};

const updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content, folder_id, tagIds } = req.body;

  try {
    const existing = await pool.query(
      `SELECT id FROM notes WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (folder_id !== undefined && folder_id !== null) {
      const ownsFolder = await validateFolderOwnership(folder_id, req.user.id);
      if (!ownsFolder) {
        return res.status(400).json({ message: "Invalid folder" });
      }
    }

    const normalizedTagIds =
      tagIds !== undefined
        ? [...new Set(tagIds.map(Number).filter((n) => !Number.isNaN(n)))]
        : null;

    if (normalizedTagIds && normalizedTagIds.length > 0) {
      const validTags = await validateTagIds(normalizedTagIds, req.user.id);
      if (!validTags) {
        return res.status(400).json({ message: "One or more tags are invalid" });
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
          await client.query("ROLLBACK");
          return res.status(400).json({ message: "Title cannot be empty" });
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

      values.push(id, req.user.id);

      const result = await client.query(
        `UPDATE notes
         SET ${updates.join(", ")}
         WHERE id = $${paramIndex++} AND user_id = $${paramIndex}
         RETURNING id, title, content, folder_id, created_at, updated_at`,
        values
      );

      const note = result.rows[0];

      if (normalizedTagIds !== null) {
        await client.query(`DELETE FROM note_tags WHERE note_id = $1`, [
          note.id,
        ]);
        await linkTagsToNote(client, note.id, normalizedTagIds);
      }

      await client.query("COMMIT");

      const tags = await fetchTagsForNote(note.id);

      res.json({
        message: "Note updated",
        data: { ...note, tags },
      });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update note" });
  }
};

const deleteNote = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM notes
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete note" });
  }
};

module.exports = {
  listNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
};
