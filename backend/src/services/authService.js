const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const { ValidationError, ConflictError, AuthenticationError } = require("../utils/errors");

async function signup({ name, email, password }) {
    // Basic validation
    if (!name || !email || !password) {
        throw new ValidationError("All fields are required");
    }

    const normalizedEmail = email.toLowerCase();

    if (!normalizedEmail.includes("@")) {
        throw new ValidationError("Invalid email format");
    }

    if (password.length < 6) {
        throw new ValidationError("Password must be at least 6 characters");
    }

    // Check existing user
    const existingUser = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
        throw new ConflictError("Email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
        `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email`,
        [name, normalizedEmail, hashedPassword]
    );

    return result.rows[0];
}

async function login({ email, password }) {
    if (!email || !password) {
        throw new ValidationError("Email and password required");
    }

    const normalizedEmail = email.toLowerCase();

    // Find user
    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [normalizedEmail]
    );

    console.log("LOGIN EMAIL:", normalizedEmail);
    console.log("ROWS FOUND:", result.rows.length);

    if (result.rows.length > 0) {
        console.log("DB EMAIL:", result.rows[0].email);
        console.log("HASH EXISTS:", !!result.rows[0].password);

        const testMatch = await bcrypt.compare(password, result.rows[0].password);
        console.log("PASSWORD MATCH:", testMatch);
    }

    if (result.rows.length === 0) {
        throw new AuthenticationError("Invalid credentials");
    }

    const user = result.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new AuthenticationError("Invalid credentials");
    }

    // Generate JWT
    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    return token;
}

async function getMe(userId) {
    const result = await pool.query(
        `SELECT id, name, email
     FROM users
     WHERE id = $1`,
        [userId]
    );

    return result.rows[0];
}

module.exports = {
    signup,
    login,
    getMe,
};