const { pool } = require("../config/database");

async function getFocusSessions(req, res) {
  try {
    const [sessions] = await pool.query(
      `
      SELECT *
      FROM focus_sessions
      WHERE user_id = ?
      ORDER BY started_at DESC
      `,
      [req.user.id]
    );

    return res.status(200).json(sessions);
  } catch (error) {
    console.error("Get focus sessions error:", error);

    return res.status(500).json({
      message: "Unable to load focus sessions"
    });
  }
}

async function createFocusSession(req, res) {
  try {
    const {
      title,
      duration
    } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Focus session title is required"
      });
    }

    const sessionDuration = Number(duration) || 25;

    const [result] = await pool.query(
      `
      INSERT INTO focus_sessions (
        user_id,
        title,
        duration_minutes,
        started_at
      )
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `,
      [
        req.user.id,
        title,
        sessionDuration
      ]
    );

    const [rows] = await pool.query(
      `
      SELECT *
      FROM focus_sessions
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
    console.error("Create focus session error:", error);

    return res.status(500).json({
      message: "Unable to create focus session"
    });
  }
}

async function completeFocusSession(req, res) {
  try {
    const [result] = await pool.query(
      `
      UPDATE focus_sessions
      SET
        completed = TRUE,
        completed_at = CURRENT_TIMESTAMP
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
        message: "Focus session not found"
      });
    }

    const [rows] = await pool.query(
      `
      SELECT *
      FROM focus_sessions
      WHERE id = ?
        AND user_id = ?
      `,
      [
        req.params.id,
        req.user.id
      ]
    );

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Complete focus session error:", error);

    return res.status(500).json({
      message: "Unable to complete focus session"
    });
  }
}

async function deleteFocusSession(req, res) {
  try {
    const [result] = await pool.query(
      `DELETE FROM focus_sessions WHERE id = ? AND user_id = ?`,
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Focus session not found" });
    }

    return res.status(200).json({ message: "Focus session deleted successfully" });
  } catch (error) {
    console.error("Delete focus session error:", error);
    return res.status(500).json({ message: "Unable to delete focus session" });
  }
}

module.exports = {
  getFocusSessions,
  createFocusSession,
  completeFocusSession,
  deleteFocusSession
};
