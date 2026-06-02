const pool = require("../db");

const listFolders = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, created_at
       FROM folders
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({
      message: "Folders retrieved",
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to list folders" });
  }
};

const createFolder = async (req, res) => {
  const { name } = req.body;

  if (!name || !String(name).trim()) {
    return res.status(400).json({ message: "Folder name is required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO folders (name, user_id)
       VALUES ($1, $2)
       RETURNING id, name, created_at`,
      [String(name).trim(), req.user.id]
    );

    res.status(201).json({
      message: "Folder created",
      data: result.rows[0],
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ message: "Folder name already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to create folder" });
  }
};

const updateFolder = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || !String(name).trim()) {
    return res.status(400).json({ message: "Folder name is required" });
  }

  try {
    const result = await pool.query(
      `UPDATE folders
       SET name = $1
       WHERE id = $2 AND user_id = $3
       RETURNING id, name, created_at`,
      [String(name).trim(), id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.json({
      message: "Folder updated",
      data: result.rows[0],
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ message: "Folder name already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to update folder" });
  }
};

const deleteFolder = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM folders
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.json({ message: "Folder deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete folder" });
  }
};

module.exports = {
  listFolders,
  createFolder,
  updateFolder,
  deleteFolder,
};
