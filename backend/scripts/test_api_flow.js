// This script demonstrates the network flow for create, update, delete
// after the local state optimization. It uses the same client.js used by
// the frontend, so the console.log statements will show the requests.

const { createNote, updateNote, deleteNote, getNote, listNotes } = require("../src/api/notes.js");
const { setToken } = require("../src/api/client.js");

async function run() {
  // Assume we have a valid token for a test user
  setToken("test-token");
  console.log("--- List notes before any mutation ---");
  await listNotes();

  console.log("--- Create a new note ---");
  const newNote = await createNote({ title: "Test", content: "Hello", folder_id: null, tagIds: [] });
  console.log("Created note id:", newNote.id);

  console.log("--- Update the note ---
  const updated = await updateNote(newNote.id, { title: "Updated", content: "World", tagIds: [], folder_id: null });
  console.log("Updated note:", updated.id);

  console.log("--- Delete the note ---");
  await deleteNote(newNote.id);
  console.log("Deleted note id:", newNote.id);
}

run().catch(err => console.error(err));