/**
 * Global error-handling middleware.
 * Must be registered AFTER all routes in app.js.
 *
 * - AppError (and subclasses) → known operational errors → safe JSON response
 * - Unknown errors → generic 500 (log full stack in non-production)
 */
const { AppError } = require("../utils/errors");

// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
    // Known operational error
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
        });
    }

    // PostgreSQL unique-violation → 409 Conflict
    if (err.code === "23505") {
        return res.status(409).json({
            message: "A resource with that value already exists",
        });
    }

    // Log unexpected errors
  const logger = require("../utils/logger");
  logger.error({msg: "Unhandled error:", err});
  // Capture in Sentry if available
  const Sentry = require("../sentry");
  if (Sentry && Sentry.captureException) {
    Sentry.captureException(err);
  }

    const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;

    // In production, don't leak stack traces
    const message =
        process.env.NODE_ENV === "production" && statusCode === 500
            ? "Internal server error"
            : err.message || "Internal server error";

    res.status(statusCode).json({ message });
}

module.exports = { errorHandler };