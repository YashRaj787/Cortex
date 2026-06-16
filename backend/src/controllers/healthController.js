// healthController.js
// Handles the /health endpoint, performing a lightweight DB check.
// It does not require authentication and returns a simple JSON status.

const { checkDatabaseConnection } = require("../db");
const logger = require("../utils/logger");

/**
 * Health check controller.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function healthCheck(req, res) {
  try {
    // Verify database connectivity
    await checkDatabaseConnection();
    // If we reach here, everything is healthy
    return res.status(200).json({ status: "ok" });
  } catch (err) {
    // Log the failure but avoid leaking sensitive info
    logger.error({ msg: "Health check failed", err });
    return res
      .status(503)
      .json({ status: "error", database: "unreachable" });
  }
}

module.exports = { healthCheck };
