import { api } from "./client.js";
import { track } from "../lib/analytics.js";

export function listFolders() {
  return api("/api/v1/folders").then((r) => r.data ?? []);
}

export function createFolder(name) {
  return api("/api/v1/folders", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

// Track folder creation
export async function createFolderWithTracking(name) {
  const res = await createFolder(name);
  if (res.ok) {
    // Do not send folder name to comply with privacy
    track("folder_created", {});
  }
  return res;
}

export function updateFolder(id, name) {
  return api(`/api/v1/folders/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name }),
  });
}

export function deleteFolder(id) {
  return api(`/api/v1/folders/${id}`, { method: "DELETE" });
}
