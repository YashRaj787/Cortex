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
      // Track search performed event with query length only
      track("search_performed", { queryLength: q.length });
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
  // Track note viewed event (no note ID to preserve privacy)
  track("note_viewed", {});
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

  // Track note update (no note ID to preserve privacy)
  export async function updateNoteWithTracking(id, payload) {
    const res = await updateNote(id, payload);
    track("note_updated", {});
    return res;
  }

export function deleteNote(id) {
  return api(`/api/v1/notes/${id}`, { method: "DELETE" });
}

  // Track note deletion (no note ID to preserve privacy)
  export async function deleteNoteWithTracking(id) {
    const res = await deleteNote(id);
    if (res.ok) {
      track("note_deleted", {});
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
    // Fetch note content length for tracking
    const note = await getNote(id);
    const contentLength = note?.content?.length || 0;
    const start = Date.now();
    // Track AI summary requested event with content length
    track("ai_summary_requested", { contentLength });
    try {
      const summary = await summarizeNote(id);
      const durationMs = Date.now() - start;
      track("ai_summary_success", { contentLength, durationMs, success: true });
      return summary;
    } catch (err) {
      const durationMs = Date.now() - start;
      track("ai_summary_failed", { contentLength, durationMs, success: false });
      throw err;
    }
  }
