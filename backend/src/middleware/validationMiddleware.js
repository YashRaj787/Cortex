// Generic validation middleware using Zod schemas.
// Returns 400 Bad Request with error details when validation fails.

/**
 * @param {import('zod').ZodSchema} schema - Zod schema to validate request body.
 * @returns {function(req, res, next)} Express middleware.
 */
function validate(schema) {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      const messages = err.errors?.map((e) => e.message).join(", ") || "Invalid request payload";
      res.status(400).json({ message: messages });
    }
  };
}

module.exports = { validate };
