// Validation schemas for tag-related routes using Zod
const { z } = require("zod");

// Create tag schema – name is required
const createTagSchema = z.object({
  name: z.string().min(1, { message: "Tag name is required" }),
});

module.exports = {
  createTagSchema,
};
