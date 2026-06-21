/**
 * Returns the configuration object for pg Pool.
 *
 * Priority order:
 *   1. If the process is running in a test environment (NODE_ENV === "test") and a
 *      dedicated test database URL is provided via DATABASE_URL_TEST, use it.
 *   2. If a generic DATABASE_URL is defined, use it (development / production).
 *   3. Fallback to individual DB connection parameters.
 */
// Ensure environment variables are loaded even when the test runner does not
// explicitly invoke dotenv. This guarantees DATABASE_URL and DATABASE_URL_TEST are
// available for both the application and the test suite.
// Load environment variables via centralized env module
require('../config/env');

function getPoolConfig() {
  // Choose the correct database based on the environment.
  const config = require("../config");

  // Use the dedicated test database only when explicitly running tests.
  if (process.env.NODE_ENV === "test" && config.databaseUrlTest) {
    return { connectionString: config.databaseUrlTest };
  }

  // For development or production use the primary DATABASE_URL.
  if (config.databaseUrl) {
    return { connectionString: config.databaseUrl };
  }

  // Fallback to individual connection parameters.
  return {
    user: config.dbUser,
    host: config.dbHost,
    database: config.dbName,
    password: config.dbPassword ? String(config.dbPassword) : "",
    port: config.dbPort,
    ssl: config.dbSsl === "true" ? { rejectUnauthorized: false } : undefined,
  };
}

module.exports = getPoolConfig;

// Debug output for test environment
// No debug output in production or test runs.
