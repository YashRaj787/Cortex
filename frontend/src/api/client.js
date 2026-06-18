import { toastError } from "../utils/toast.js";
import * as Sentry from "@sentry/react";

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

const TOKEN_KEY = "cortex_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

/**
 * Thin wrapper around fetch for the Cortex API.
 * Attaches JSON headers and Bearer token when present.
 */
export async function api(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  console.log("API_REQUEST", options.method || "GET", path);
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errMsg = data.message || `Request failed (${res.status})`;
      toastError(errMsg);
      throw new Error(errMsg);
    }

    return data;
  } catch (err) {
    // Capture unexpected errors in Sentry
    if (Sentry && Sentry.captureException) {
      Sentry.captureException(err);
    }
    if (err.name === "TypeError" && err.message === "Failed to fetch") {
      toastError("Network error. Please check your connection.");
    } else if (!err.message.startsWith("Request failed")) {
      // Only show for unexpected errors (network errors, etc.)
      // API errors are already handled above
      toastError(err.message || "Something went wrong");
    }
    throw err;
  }
}

export { API_BASE };