// Reusable rate limiting middleware using express-rate-limit.
// Provides two configurations:
// 1. authRateLimiter: 10 requests per 15 minutes per IP for auth routes (production).
// 2. summarizeRateLimiter: 20 requests per hour per IP for note summarization.

const rateLimit = require('express-rate-limit');

const isDevelopment = process.env.NODE_ENV === 'development';

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

/**
 * Creates a no-op middleware that passes all requests through.
 * Used in development mode to disable rate limiting.
 * @returns {import('express').RequestHandler}
 */
function createNoOpLimiter() {
  return (req, res, next) => next();
}

// 100 requests per 15 minutes per IP for authentication routes.
// Disabled in development (NODE_ENV=development).
const authRateLimiter = isDevelopment
  ? createNoOpLimiter()
  : createJsonRateLimiter({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100,
    });

// 200 requests per hour per IP for note summarization.
const summarizeRateLimiter = createJsonRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 200,
});

module.exports = {
  authRateLimiter,
  summarizeRateLimiter,
};
