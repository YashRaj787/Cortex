import { api } from "./client.js";

export function listFolders() {
  return api("/api/v1/folders").then((r) => r.data ?? []);
}

export function createFolder(name) {
  return api("/api/v1/folders", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
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
