const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const pool = require("../db");
const signup = async (req, res) => {

  let { name, email, password } = req.body;

  try {

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Normalize email
    email = email.toLowerCase();

    // Basic password validation
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    // Basic email validation
    if (!email.includes("@")) {
      return res.status(400).json({
        message: "Invalid email format"
      });
    }

    // Check existing user
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [name, email, hashedPassword]
    );

    res.status(201).json({
      message: "User created successfully",
      user: result.rows[0]
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Signup failed"
    });

  }

};
const login = async (req, res) => {

  let { email, password } = req.body;

  try {

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required"
      });
    }

    // Normalize email
    email = email.toLowerCase();

    // Find user
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const user = result.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Login failed"
    });

  }

};
const getMe = async (req, res) => {

  try {

    const result = await pool.query(
      `SELECT id, name, email
       FROM users
       WHERE id = $1`,
      [req.user.id]
    );

    res.json(result.rows[0]);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Failed to get user"
    });

  }
 
};
 module.exports = {
  signup,
  login,
  getMe
};