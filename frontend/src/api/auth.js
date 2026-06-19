import { api } from "./client.js";
import { track } from "../lib/analytics.js";

export function signup(name, email, password) {
  return api("/api/v1/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

// Track signup success after API call resolves
// (Removed to comply with new requirements)
export async function signupWithTracking(name, email, password) {
  const res = await signup(name, email, password);
  // Track signup success event with no properties
  track("signup_success", {});
  return res;
}

export function login(email, password) {
  return api("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// Track login success after API call resolves
// (Removed to comply with new requirements)
export async function loginWithTracking(email, password) {
  const res = await login(email, password);
  // Track login success event with no properties
  track("login_success", {});
  return res;
}

// Logout function – tracks logout event
export async function logout() {
  // Assuming there is an API endpoint for logout; if not, just track
try {
    await api("/api/v1/auth/logout", { method: "POST" });
  } catch {
    // ignore errors
  }
  track("logout", {});
}

export function getMe() {
  return api("/api/v1/auth/me");
}
