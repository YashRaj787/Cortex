// Configuration for the feedback system
// The Google Form URL is read from the VITE_FEEDBACK_FORM_URL env var.
// Set it in .env (local) or .env.production (deployed).
// The form should have fields for type (Bug Report, Feature Request, General Feedback)
// and a message textarea.
export const GOOGLE_FORM_URL =
  import.meta.env.VITE_FEEDBACK_FORM_URL || "";
