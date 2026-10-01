const { pool } = require("../config/database");

async function getThoughts(req, res) {
  try {
    const [thoughts] = await pool.query(
      `
      SELECT
        id,
        content,
        mood,
        created_at,
        updated_at
      FROM thoughts
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    return res.status(200).json(thoughts);
  } catch (error) {
    console.error("Get thoughts error:", error);

    return res.status(500).json({
      message: "Unable to load thoughts"
    });
  }
}

async function createThought(req, res) {
  try {
    const {
      content,
      mood
    } = req.body;

    if (!content) {
      return res.status(400).json({
        message: "Thought content is required"
      });
    }

    const [result] = await pool.query(
      `
      INSERT INTO thoughts (
        user_id,
        content,
        mood
      )
      VALUES (?, ?, ?)
      `,
      [
        req.user.id,
        content,
        mood || null
      ]
    );

    const [rows] = await pool.query(
      `
      SELECT *
      FROM thoughts
      WHERE id = ?
        AND user_id = ?
      `,
      [
        result.insertId,
        req.user.id
      ]
    );

    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Create thought error:", error);

    return res.status(500).json({
      message: "Unable to save thought"
    });
  }
}

async function deleteThought(req, res) {
  try {
    const [result] = await pool.query(
      `
      DELETE FROM thoughts
      WHERE id = ?
        AND user_id = ?
      `,
      [
        req.params.id,
        req.user.id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Thought not found"
      });
    }

    return res.status(200).json({
      message: "Thought deleted successfully"
    });
  } catch (error) {
    console.error("Delete thought error:", error);

    return res.status(500).json({
      message: "Unable to delete thought"
    });
  }
}

module.exports = {
  getThoughts,
  createThought,
  deleteThought
};
