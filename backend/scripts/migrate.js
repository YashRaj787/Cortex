// Load environment variables via centralized env module
require("../src/config/env");
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
const getPoolConfig = require("../src/db/config");

const poolConfig = getPoolConfig();
console.log('Using DB config:', poolConfig);
const pool = new Pool(poolConfig);

const REQUIRED_TABLES = ["users", "folders", "notes", "tags", "note_tags"];

async function migrate() {
  try {
  // Path to migrations directory – the folder created for versioned migrations
  const migrationsDir = path.join(__dirname, "..", "migrations");

  // Ensure schema_migrations table exists
  await pool.query(
    `CREATE TABLE IF NOT EXISTS schema_migrations (
       version VARCHAR(20) PRIMARY KEY,
       applied_at TIMESTAMPTZ DEFAULT NOW()
     );`
  );

  // Read all .sql files in migrations directory
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort(); // numeric prefix sorting

  // Get already applied migrations
  const appliedRes = await pool.query("SELECT version FROM schema_migrations");
  const appliedVersions = appliedRes.rows.map((r) => r.version);

  // Apply pending migrations
  for (const file of migrationFiles) {
    const version = file.split("_")[0]; // e.g., 001
    if (appliedVersions.includes(version)) {
      console.log(`Skipping already applied migration ${file}`);
      continue;
    }
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    try {
      await pool.query(sql);
      await pool.query(
        "INSERT INTO schema_migrations (version) VALUES ($1)",
        [version]
      );
      console.log(`Applied migration ${file}`);
    } catch (err) {
      console.error(`Failed to apply migration ${file}:`, err.message);
      process.exit(1);
    }
  }

  // Verify required tables still exist
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

  // Final verification already performed above
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
