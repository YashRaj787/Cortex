// Analytics wrapper for PostHog
// This module centralises all analytics logic so that the rest of the codebase
// never imports PostHog directly.

import posthog from 'posthog-js';

/**
 * Initialise PostHog if a key is provided via the VITE_POSTHOG_KEY env var.
 * The function is idempotent – calling it multiple times will not re‑initialise
 * PostHog.
 */
export function initPostHog() {
  if (typeof window === 'undefined') return; // SSR guard
  const key = import.meta.env.VITE_POSTHOG_KEY;
  if (!key) {
    console.info('[Analytics] PostHog key not found – analytics disabled');
    return;
  }
  if (window.__posthog__) return; // already initialised
  const host = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';
  posthog.init(key, {
    api_host: host,
    persistence: 'localStorage',
    capture_pageview: false,
  });
  window.__posthog__ = posthog;
}

/**
 * Track an event with optional properties.
 * If PostHog is not initialised, the call is a no‑op.
 */
export function track(eventName, properties = {}) {
  if (!window.__posthog__) return;
  // Sanitize properties – remove any sensitive data
  const sanitized = { ...properties };
  // Remove any keys that contain sensitive data
  Object.keys(sanitized).forEach((k) => {
    // Disallow email, password, jwt
    if (/password|jwt|email/i.test(k)) {
      delete sanitized[k];
    }
  });
  window.__posthog__.capture(eventName, sanitized);
}
