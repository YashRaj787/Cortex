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
  posthog.init(key, {
    api_host: 'https://app.posthog.com',
    persistence: 'localStorage',
    // Disable auto pageview tracking – we will track manually
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
  // Remove any keys that contain 'password', 'jwt', 'email'
  Object.keys(sanitized).forEach((k) => {
    if (/password|jwt|email/i.test(k)) delete sanitized[k];
  });
  window.__posthog__.capture(eventName, sanitized);
}
