const { pool } = require("../config/database");

async function getFilters(req, res) {
  try {
    const [filters] = await pool.query(
      `
      SELECT *
      FROM filters
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    return res.status(200).json(filters);
  } catch (error) {
    console.error("Get filters error:", error);

    return res.status(500).json({
      message: "Unable to load filters"
    });
  }
}

async function createFilter(req, res) {
  try {
    const {
      thought,
      category,
      reality,
      action
    } = req.body;

    if (!thought || !thought.trim()) {
      return res.status(400).json({
        message: "Thought is required"
      });
    }

    const [result] = await pool.query(
      `
      INSERT INTO filters (
        user_id,
        thought,
        category,
        reality,
        action
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        req.user.id,
        thought.trim(),
        category || null,
        reality || null,
        action || null
      ]
    );

    const [rows] = await pool.query(
      `
      SELECT *
      FROM filters
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
    console.error("Create filter error:", error);

    return res.status(500).json({
      message: "Unable to save filter"
    });
  }
}

async function toggleFilter(req, res) {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      `
      UPDATE filters
      SET completed = NOT completed
      WHERE id = ?
        AND user_id = ?
      `,
      [
        id,
        req.user.id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Filter not found"
      });
    }

    const [rows] = await pool.query(
      `
      SELECT *
      FROM filters
      WHERE id = ?
        AND user_id = ?
      `,
      [
        id,
        req.user.id
      ]
    );

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Toggle filter error:", error);

    return res.status(500).json({
      message: "Unable to update filter"
    });
  }
}

async function deleteFilter(req, res) {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      `
      DELETE FROM filters
      WHERE id = ?
        AND user_id = ?
      `,
      [
        id,
        req.user.id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Filter not found"
      });
    }

    return res.status(200).json({
      message: "Filter deleted successfully"
    });
  } catch (error) {
    console.error("Delete filter error:", error);

    return res.status(500).json({
      message: "Unable to delete filter"
    });
  }
}

module.exports = {
  getFilters,
  createFilter,
  toggleFilter,
  deleteFilter
};