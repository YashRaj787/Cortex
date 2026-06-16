// Backend Sentry initialization
// This module sets up Sentry for Express and global error handling.
// It respects the SENTRY_DSN_BACKEND environment variable and will
// gracefully skip initialization if the DSN is not provided.

const Sentry = require('@sentry/node');
const { Integrations } = require('@sentry/tracing');
const dotenv = require('dotenv');

dotenv.config();

const dsn = process.env.SENTRY_DSN_BACKEND;

if (dsn) {
  Sentry.init({
    dsn,
    integrations: [new Integrations.Http({ tracing: true })],
    tracesSampleRate: 1.0,
    beforeSend(event) {
      // Filter out sensitive data from request and user info
      if (event.request) {
        // Remove headers that may contain tokens
        if (event.request.headers) {
          const filteredHeaders = {};
          for (const [key, value] of Object.entries(event.request.headers)) {
            if (!/authorization|cookie|set-cookie/i.test(key)) {
              filteredHeaders[key] = value;
            }
          }
          event.request.headers = filteredHeaders;
        }
        // Remove body if it contains sensitive keys
        if (event.request.body && typeof event.request.body === 'object') {
          const filteredBody = {};
          for (const [k, v] of Object.entries(event.request.body)) {
            if (!/password|jwt|apiKey|token|secret|credential/i.test(k)) {
              filteredBody[k] = v;
            }
          }
          event.request.body = filteredBody;
        }
      }
      return event;
    },
  });
  console.log('Sentry initialized for backend');
} else {
  console.log('SENTRY_DSN_BACKEND not set – Sentry disabled for backend');
}

module.exports = Sentry;