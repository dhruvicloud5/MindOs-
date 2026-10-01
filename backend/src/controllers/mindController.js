const { pool } = require("../config/database");

async function getMindEntries(req, res) {
  try {
    const [entries] = await pool.query(
      `
      SELECT *
      FROM mind_entries
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 20
      `,
      [req.user.id]
    );

    return res.status(200).json(entries);
  } catch (error) {
    console.error("Get mind entries error:", error);

    return res.status(500).json({
      message: "Unable to load mind entries"
    });
  }
}

async function createMindEntry(req, res) {
  try {
    const {
      energy,
      clarity,
      stress,
      mood,
      note
    } = req.body;

    const energyValue = Number(energy) || 5;
    const clarityValue = Number(clarity) || 5;
    const stressValue = Number(stress) || 5;

    const [result] = await pool.query(
      `
      INSERT INTO mind_entries (
        user_id,
        energy,
        clarity,
        stress,
        mood,
        note
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        req.user.id,
        energyValue,
        clarityValue,
        stressValue,
        mood || null,
        note || null
      ]
    );

    const [rows] = await pool.query(
      `
      SELECT *
      FROM mind_entries
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
    console.error("Create mind entry error:", error);

    return res.status(500).json({
      message: "Unable to save mind check-in"
    });
  }
}

module.exports = {
  getMindEntries,
  createMindEntry
};
