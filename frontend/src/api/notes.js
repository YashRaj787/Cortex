import { api } from "./client.js";
import { track } from "../lib/analytics.js";

export function listNotes(folderFilter = "all", searchQuery = "") {
  const params = new URLSearchParams();
  if (folderFilter !== "all" && folderFilter !== "none") {
    params.set("folder_id", folderFilter);
  }
  const q = searchQuery.trim();
  if (q) {
    params.set("q", q);
    // Track search performed event
    track("search_performed", { query: q });
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
  // Track note viewed event
  track("note_viewed", { id });
  return api(`/api/v1/notes/${id}`).then((r) => r.data);
}

export function createNote(payload) {
  return api("/api/v1/notes", {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((r) => r.data);
}

// Track note creation
export async function createNoteWithTracking(payload) {
  const res = await createNote(payload);
  // res is the created note data
  track("note_created", { contentLength: res.content?.length || 0 });
  return res;
}

export function updateNote(id, { title, content, tagIds, folder_id }) {
  return api(`/api/v1/notes/${id}`, {
    method: "PUT",
    body: JSON.stringify({ title, content, tagIds, folder_id }),
  }).then((r) => r.data);
}

// Track note update
export async function updateNoteWithTracking(id, payload) {
  const res = await updateNote(id, payload);
  track("note_updated", { id });
  return res;
}

export function deleteNote(id) {
  return api(`/api/v1/notes/${id}`, { method: "DELETE" });
}

// Track note deletion
export async function deleteNoteWithTracking(id) {
  const res = await deleteNote(id);
  if (res.ok) {
    track("note_deleted", { id });
  }
  return res;
}

export function summarizeNote(id) {
  return api(`/api/v1/notes/${id}/summarize`, { method: "POST" }).then(
    (r) => r.data.summary
  );
}

// Track AI summary events
export async function summarizeNoteWithTracking(id) {
  // Track AI summary requested event
  track("ai_summary_requested", { id });
  try {
    const summary = await summarizeNote(id);
    track("ai_summary_success", { id });
    return summary;
  } catch (err) {
    track("ai_summary_failed", { id, error: err.message });
    throw err;
  }
}
