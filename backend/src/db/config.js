function getPoolConfig() {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
    };
  }

  return {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    // Ensure password is a string for pg client; fallback to empty string if undefined
    password: process.env.DB_PASSWORD ? String(process.env.DB_PASSWORD) : "",
    port: process.env.DB_PORT,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
  };
}

module.exports = getPoolConfig;

// Debug output for test environment
if (process.env.NODE_ENV === "test") {
  console.log("DB Config:", {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: typeof process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
}
