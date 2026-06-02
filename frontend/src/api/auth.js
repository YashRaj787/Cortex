import { api } from "./client.js";

export function signup(name, email, password) {
  return api("/api/v1/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function login(email, password) {
  return api("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getMe() {
  return api("/api/v1/auth/me");
}
