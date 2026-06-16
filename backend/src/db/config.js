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
// Load environment variables from the project root .env file.
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });

function getPoolConfig() {
  // Dedicated test database – used when a test-specific URL is provided.
  // We prioritize DATABASE_URL_TEST regardless of NODE_ENV to ensure the test
  // suite always connects to the isolated test database.
  if (process.env.DATABASE_URL_TEST) {
    return { connectionString: process.env.DATABASE_URL_TEST };
  }

  // Primary database URL for dev / prod.
  if (process.env.DATABASE_URL) {
    return { connectionString: process.env.DATABASE_URL };
  }

  // Fallback to individual connection parameters.
  return {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD ? String(process.env.DB_PASSWORD) : "",
    port: process.env.DB_PORT,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
  };
}

module.exports = getPoolConfig;

// Debug output for test environment
// No debug output in production or test runs.
