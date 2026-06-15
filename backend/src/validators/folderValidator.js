// Validation schemas for folder-related routes using Zod
const { z } = require("zod");

// Create folder schema – name is required
const createFolderSchema = z.object({
  name: z.string().min(1, { message: "Folder name is required" }),
});

module.exports = {
  createFolderSchema,
};
