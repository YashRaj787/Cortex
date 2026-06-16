const { Pool } = require("pg");
const getPoolConfig = require("./config");

let pool;

/**
 * Database pool initialization.
 *
 * - In a test run (NODE_ENV === "test") we rely on a dedicated test
 *   PostgreSQL instance defined by DATABASE_URL_TEST. The `getPoolConfig`
 *   function (see src/db/config.js) already prefers this variable when the
 *   environment is "test".
 * - In all other environments (development, production) we use the standard
 *   configuration which prefers DATABASE_URL.
 */
pool = new Pool(getPoolConfig());

async function checkDatabaseConnection() {
  await pool.query("SELECT 1");
}

module.exports = pool;
module.exports.checkDatabaseConnection = checkDatabaseConnection;

