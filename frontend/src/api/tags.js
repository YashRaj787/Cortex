import { api } from "./client.js";
import { track } from "../lib/analytics.js";

export function listTags() {
  return api("/api/v1/tags").then((r) => r.data ?? []);
}

export function createTag(name) {
  return api("/api/v1/tags", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

  // Track tag creation
  export async function createTagWithTracking(name) {
    const res = await createTag(name);
    if (res.ok) {
      // Do not send tag name to comply with privacy
      track("tag_created", {});
    }
    return res;
  }

export function deleteTag(id) {
  return api(`/api/v1/tags/${id}`, { method: "DELETE" });
}
