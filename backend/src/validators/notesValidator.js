// Validation schemas for note-related routes using Zod
const { z } = require("zod");

// Create note schema – expects title (required) and optional content
const createNoteSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().optional(),
});

// Update note schema – allows partial updates but requires at least one field
const updateNoteSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update",
});

module.exports = {
  createNoteSchema,
  updateNoteSchema,
};
