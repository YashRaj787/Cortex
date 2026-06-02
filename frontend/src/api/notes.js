import { api } from "./client.js";

export function listNotes(folderFilter = "all") {
  let path = "/api/v1/notes";
  if (folderFilter !== "all" && folderFilter !== "none") {
    path += `?folder_id=${folderFilter}`;
  }
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
