// Reusable rate limiting middleware using express-rate-limit.
// Provides two configurations:
// 1. authRateLimiter: 10 requests per 15 minutes per IP for auth routes.
// 2. summarizeRateLimiter: 20 requests per hour per IP for note summarization.

const rateLimit = require('express-rate-limit');

/**
 * Helper to create a rate limiter with a JSON 429 response.
 * @param {Object} options - Options for express-rate-limit.
 * @param {number} options.windowMs - Time window in milliseconds.
 * @param {number} options.max - Max number of requests per window per IP.
 * @returns {import('express').RequestHandler}
 */
function createJsonRateLimiter({ windowMs, max }) {
  return rateLimit({
    windowMs,
    max,
    // Include rate limit info in the `RateLimit-*` headers.
    standardHeaders: true,
    // Disable the legacy `X-RateLimit-*` headers.
    legacyHeaders: false,
    // Custom handler to return JSON instead of plain text.
    handler: (req, res) => {
      res.status(429).json({
        message: 'Too many requests, please try again later.',
      });
    },
  });
}

// 10 requests per 15 minutes per IP for authentication routes.
const authRateLimiter = createJsonRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
});

// 20 requests per hour per IP for note summarization.
const summarizeRateLimiter = createJsonRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
});

module.exports = {
  authRateLimiter,
  summarizeRateLimiter,
};
