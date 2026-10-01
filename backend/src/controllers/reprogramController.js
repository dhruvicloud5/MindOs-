const { pool } = require("../config/database");

async function getReprograms(req, res) {
  try {
    const [reprograms] = await pool.query(
      `
      SELECT *
      FROM reprograms
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    return res.status(200).json(reprograms);
  } catch (error) {
    console.error("Get reprograms error:", error);

    return res.status(500).json({
      message: "Unable to load reprograms"
    });
  }
}

async function createReprogram(req, res) {
  try {
    const { title, description, affirmation } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Reprogram title is required"
      });
    }

    const [result] = await pool.query(
      `
      INSERT INTO reprograms (
        user_id,
        title,
        description,
        affirmation
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        req.user.id,
        title.trim(),
        description || null,
        affirmation || null
      ]
    );

    const [rows] = await pool.query(
      `
      SELECT *
      FROM reprograms
      WHERE id = ?
        AND user_id = ?
      `,
      [result.insertId, req.user.id]
    );

    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Create reprogram error:", error);

    return res.status(500).json({
      message: "Unable to create reprogram"
    });
  }
}

async function completeReprogram(req, res) {
  try {
    const [result] = await pool.query(
      `
      UPDATE reprograms
      SET
        completed = NOT completed,
        completed_at = CASE
          WHEN completed = FALSE
          THEN CURRENT_TIMESTAMP
          ELSE NULL
        END
      WHERE id = ?
        AND user_id = ?
      `,
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Reprogram not found"
      });
    }

    const [rows] = await pool.query(
      `
      SELECT *
      FROM reprograms
      WHERE id = ?
        AND user_id = ?
      `,
      [req.params.id, req.user.id]
    );

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Complete reprogram error:", error);

    return res.status(500).json({
      message: "Unable to update reprogram"
    });
  }
}

async function deleteReprogram(req, res) {
  try {
    const [result] = await pool.query(
      `
      DELETE FROM reprograms
      WHERE id = ?
        AND user_id = ?
      `,
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Reprogram not found"
      });
    }

    return res.status(200).json({
      message: "Reprogram deleted successfully"
    });
  } catch (error) {
    console.error("Delete reprogram error:", error);

    return res.status(500).json({
      message: "Unable to delete reprogram"
    });
  }
}

module.exports = {
  getReprograms,
  createReprogram,
  completeReprogram,
  deleteReprogram
};
