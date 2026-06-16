// requestLogger.js
// Middleware to log every HTTP request with structured data using Pino.
// It logs after the response is finished to capture statusCode and duration.
// Sensitive data such as passwords, JWT tokens, API keys, or request bodies
// containing credentials are intentionally omitted.

const logger = require("../utils/logger");

/**
 * Express middleware that logs request details.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
function requestLogger(req, res, next) {
  const start = process.hrtime();

  // Listen for the finish event to log after response is sent
  res.on("finish", () => {
    const diff = process.hrtime(start);
    const durationMs = diff[0] * 1e3 + diff[1] / 1e6;

    const logEntry = {
      method: req.method,
      route: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Math.round(durationMs),
    };

    if (durationMs > 1000) {
      logger.warn(logEntry);
    } else {
      logger.info(logEntry);
    }
  });

  next();
}

module.exports = requestLogger;
