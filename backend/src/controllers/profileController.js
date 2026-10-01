const { pool } = require("../config/database");

async function getProfile(req, res) {
  try {
    const [users] = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE id = ?",
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(users[0]);

  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      message: "Unable to load profile"
    });
  }
}

module.exports = {
  getProfile
};