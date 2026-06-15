const { Pool } = require("pg");
const getPoolConfig = require("./config");

let pool;

// In test environment use an in‑memory PostgreSQL instance via pg‑mem
// Use in‑memory pg‑mem for any non‑production environment (including test runs)
if (process.env.NODE_ENV !== "production") {
  // pg-mem v2 uses a factory function `newDb` to create an in‑memory DB instance
  const { newDb } = require("pg-mem");
  const db = newDb();
  // Load the schema migration used by the app
  const fs = require("fs");
  const path = require("path");
  const migrationPath = path.join(__dirname, "..", "scripts", "migrate.js");
  // The migrate script expects a real pg Pool, so we replicate its core logic here
  // Migration file resides in the same directory under migrations
  const sqlPath = path.join(__dirname, "migrations", "001_initial_schema.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");
  db.public.none(sql);
  // pg-mem provides connection config; create a pg Pool so we have .query and .end
  const pgConfig = db.adapters.createPg();
  pool = new Pool(pgConfig);
} else {
  pool = new Pool(getPoolConfig());
}

async function checkDatabaseConnection() {
  await pool.query("SELECT 1");
}

module.exports = pool;
module.exports.checkDatabaseConnection = checkDatabaseConnection;

