import { api } from "./client.js";

export function listTags() {
  return api("/api/v1/tags").then((r) => r.data ?? []);
}

export function createTag(name) {
  return api("/api/v1/tags", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export function deleteTag(id) {
  return api(`/api/v1/tags/${id}`, { method: "DELETE" });
}
