// Central configuration module
// Exposes selected environment variables for use throughout the application.
// This file imports the centralized env loader and re‑exports the values
// that are required by the codebase.

const env = require('./env');

module.exports = {
  jwtSecret: env.JWT_SECRET,
  databaseUrl: env.DATABASE_URL,
  databaseUrlTest: env.DATABASE_URL_TEST,
  openaiApiKey: env.GEMINI_API_KEY,
  port: env.PORT,
  nodeEnv: env.NODE_ENV,
  corsOrigin: env.CORS_ORIGIN,
  logLevel: env.LOG_LEVEL,
  sentryDsnBackend: env.SENTRY_DSN_BACKEND,
  dbUser: env.DB_USER,
  dbHost: env.DB_HOST,
  dbName: env.DB_NAME,
  dbPassword: env.DB_PASSWORD,
  dbPort: env.DB_PORT,
  dbSsl: env.DB_SSL,
};
