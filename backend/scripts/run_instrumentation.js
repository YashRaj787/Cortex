// This script demonstrates the instrumentation added to the services.
// It connects to the test database, runs a few queries, and prints the
// resulting logs to the console.

const { Pool } = require("pg");
const logger = require("../src/utils/logger");
const notesService = require("../src/services/notesService");
const foldersService = require("../src/services/foldersService");
const tagsService = require("../src/services/tagsService");

async function main() {
  const userId = 1; // assume test user
  console.log("Running notes list...");
  await notesService.listNotes(userId, { page: 1, limit: 5 });
  console.log("Running notes search...");
  await notesService.listNotes(userId, { q: "test", page: 1, limit: 5 });
  console.log("Running folders list...");
  await foldersService.listFolders(userId, { page: 1, limit: 5 });
  console.log("Running tags list...");
  await tagsService.listTags(userId, { page: 1, limit: 5 });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
