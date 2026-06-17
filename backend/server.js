// Load environment variables once via centralized env module
require("./src/config/env");

const app = require("./src/app");
// Initialize Sentry for backend
require("./src/sentry");
const pool = require("./src/db");
const { checkDatabaseConnection } = pool;

const PORT = process.env.PORT || 3000;

const logger = require("./src/utils/logger");
const { version } = require("./package.json");

async function startServer() {
  try {
    await checkDatabaseConnection();
    logger.info({msg: "Database connected"});
    logger.info({msg: "Application version", version});

    const server = app.listen(PORT, () => {
      logger.info({msg: "Server running on port", port: PORT});
    });

    // Graceful shutdown
    const shutdown = async () => {
      logger.info({msg: "Application shutdown initiated"});
      await pool.end();
      server.close(() => {
      logger.info({msg: "Server closed"});
        process.exit(0);
      });
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (err) {
    logger.error({msg: "Database connection failed", err});
    // Capture DB connection failure in Sentry
    const Sentry = require("./src/sentry");
    if (Sentry && Sentry.captureException) {
      Sentry.captureException(err);
    }
    await pool.end();
    process.exitCode = 1;
  }
}

startServer();

// Global unhandled exception and rejection handlers
process.on("uncaughtException", (err) => {
  const Sentry = require("./src/sentry");
  if (Sentry && Sentry.captureException) {
    Sentry.captureException(err);
  }
  logger.error({msg: "Uncaught Exception", err});
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  const Sentry = require("./src/sentry");
  if (Sentry && Sentry.captureException) {
    Sentry.captureException(reason);
  }
  logger.error({msg: "Unhandled Rejection", reason});
});
