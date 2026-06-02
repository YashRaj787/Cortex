const pool = require("../db");

const listTags = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, created_at
       FROM tags
       WHERE user_id = $1
       ORDER BY name ASC`,
      [req.user.id]
    );

    res.json({
      message: "Tags retrieved",
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to list tags" });
  }
};

const createTag = async (req, res) => {
  const { name } = req.body;

  if (!name || !String(name).trim()) {
    return res.status(400).json({ message: "Tag name is required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO tags (name, user_id)
       VALUES ($1, $2)
       RETURNING id, name, created_at`,
      [String(name).trim(), req.user.id]
    );

    res.status(201).json({
      message: "Tag created",
      data: result.rows[0],
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ message: "Tag name already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to create tag" });
  }
};

const deleteTag = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM tags
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Tag not found" });
    }

    res.json({ message: "Tag deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete tag" });
  }
};

module.exports = {
  listTags,
  createTag,
  deleteTag,
};
