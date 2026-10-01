const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { pool } = require("../config/database");

async function signup(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters"
      });
    }

    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "An account with this email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await pool.query(
      `
      INSERT INTO users (name, email, password)
      VALUES (?, ?, ?)
      `,
      [name, email, hashedPassword]
    );

    const token = jwt.sign(
      {
        id: result.insertId,
        email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    return res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id: result.insertId,
        name,
        email
      }
    });

  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Something went wrong"
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Something went wrong"
    });
  }
}

module.exports = {
  signup,
  login
};
