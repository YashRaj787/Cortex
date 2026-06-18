import { api } from "./client.js";

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
  // No tracking for signup
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
  // No tracking for login
  return res;
}

export function getMe() {
  return api("/api/v1/auth/me");
}
