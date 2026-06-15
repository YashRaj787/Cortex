// Validation schemas for authentication routes using Zod
// No TypeScript – plain JavaScript
const { z } = require("zod");

// Signup requires name, email, password
const signupSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Login requires email and password
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

module.exports = {
  signupSchema,
  loginSchema,
};
