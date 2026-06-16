// Frontend Sentry initialization
// Uses VITE_SENTRY_DSN_FRONTEND environment variable
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

const dsn = import.meta.env.VITE_SENTRY_DSN_FRONTEND;

if (dsn) {
  Sentry.init({
    dsn,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
    beforeSend(event) {
      // Filter sensitive headers
      if (event.request && event.request.headers) {
        const filtered = {};
        for (const [k, v] of Object.entries(event.request.headers)) {
          if (!/authorization|cookie|set-cookie/i.test(k)) {
            filtered[k] = v;
          }
        }
        event.request.headers = filtered;
      }
      // Filter sensitive body keys
      if (event.request && event.request.body && typeof event.request.body === "object") {
        const filteredBody = {};
        for (const [k, v] of Object.entries(event.request.body)) {
          if (!/password|jwt|apiKey|token|secret|credential/i.test(k)) {
            filteredBody[k] = v;
          }
        }
        event.request.body = filteredBody;
      }
      return event;
    },
  });
  console.log("Sentry initialized for frontend");
} else {
  console.log("SENTRY_DSN_FRONTEND not set – Sentry disabled for frontend");
}

export default Sentry;