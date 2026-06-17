/**
 * Script to create the dedicated test database `cortex_test` if it does not exist.
 * It reads connection parameters from the environment (via .env) and uses the
 * `pg` client to issue a CREATE DATABASE command.
 */
// Load environment variables via centralized env module
require('../src/config/env');
const { Client } = require('pg');

// Build a connection config using the regular development credentials.
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME, // connect to existing DB to run CREATE DATABASE
});

async function ensureTestDb() {
  try {
    await client.connect();
    const res = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      ["cortex_test"]
    );
    if (res.rowCount === 0) {
      console.log("Creating test database 'cortex_test'...");
      await client.query('CREATE DATABASE cortex_test;');
      console.log("Test database created.");
    } else {
      console.log("Test database already exists.");
    }
  } catch (err) {
    console.error('Error ensuring test database:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

ensureTestDb();