require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
const getPoolConfig = require("../src/db/config");

const pool = new Pool(getPoolConfig());

const REQUIRED_TABLES = ["users", "folders", "notes", "tags", "note_tags"];

async function migrate() {
  const sqlPath = path.join(
    __dirname,
    "..",
    "src",
    "db",
    "migrations",
    "001_initial_schema.sql"
  );
  const sql = fs.readFileSync(sqlPath, "utf8");

  try {
    await pool.query(sql);
    const result = await pool.query(
      `SELECT table_name
       FROM information_schema.tables
       WHERE table_schema = 'public'
         AND table_name = ANY($1::text[])
       ORDER BY table_name`,
      [REQUIRED_TABLES]
    );
    const existingTables = result.rows.map(({ table_name }) => table_name);
    const missingTables = REQUIRED_TABLES.filter(
      (table) => !existingTables.includes(table)
    );

    if (missingTables.length > 0) {
      throw new Error(`Missing required tables: ${missingTables.join(", ")}`);
    }

    console.log(`Migration completed. Verified tables: ${existingTables.join(", ")}`);
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
