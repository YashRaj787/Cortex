// logger.js
// A centralized logger using Pino for structured logging.
// All application code should import this module instead of using console.log/error.
//
// Pino automatically includes timestamp, level, and message. For error logs, passing
// an Error object will include stack trace and message.

const pino = require("pino");

// Configure Pino. In production we use the default level; in development we can
// override via LOG_LEVEL env var.
const config = require("../config");
const logger = pino({
  level: config.logLevel || "info",
  timestamp: pino.stdTimeFunctions.isoTime,
});

module.exports = logger;
