import { api } from "./client.js";

export function listNotes(folderFilter = "all", searchQuery = "") {
  const params = new URLSearchParams();
  if (folderFilter !== "all" && folderFilter !== "none") {
    params.set("folder_id", folderFilter);
  }
  const q = searchQuery.trim();
  if (q) {
    params.set("q", q);
  }
  const query = params.toString();
  const path = query ? `/api/v1/notes?${query}` : "/api/v1/notes";

  return api(path).then((result) => {
    let data = result.data ?? [];
    if (folderFilter === "none") {
      data = data.filter((note) => note.folder_id == null);
    }
    return data;
  });
}

export function getNote(id) {
  return api(`/api/v1/notes/${id}`).then((r) => r.data);
}

export function createNote(payload) {
  return api("/api/v1/notes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateNote(id, { title, content, tagIds, folder_id }) {
  return api(`/api/v1/notes/${id}`, {
    method: "PUT",
    body: JSON.stringify({ title, content, tagIds, folder_id }),
  }).then((r) => r.data);
}

export function deleteNote(id) {
  return api(`/api/v1/notes/${id}`, { method: "DELETE" });
}

export function summarizeNote(id) {
  return api(`/api/v1/notes/${id}/summarize`, { method: "POST" }).then(
    (r) => r.data.summary
  );
}
