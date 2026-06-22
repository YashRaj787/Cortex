const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const requestLogger = require("./middleware/requestLogger");
const config = require("./config");
// Load Sentry initialization (will call Sentry.init if DSN is set)
const Sentry = require("./sentry");

const app = express();
// Apply Helmet middleware globally to set secure HTTP headers
app.use(helmet());
// Sentry request & tracing middleware – must be added before any routes
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

const authRoutes = require("./routes/authRoutes");
const notesRoutes = require("./routes/notesRoutes");
const foldersRoutes = require("./routes/foldersRoutes");
const tagsRoutes = require("./routes/tagsRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");

const allowedOrigins = (config.corsOrigin || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
// Log all incoming requests
  app.use(requestLogger);

 // Health check endpoint – no auth required
 const { healthCheck } = require("./controllers/healthController");
 app.get("/health", healthCheck);


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/notes", notesRoutes);
app.use("/api/v1/folders", foldersRoutes);
app.use("/api/v1/tags", tagsRoutes);

  app.get("/", (req, res) => {
    res.send("Cortex API running");
  });

  // ---------------------------------------------------------------------
  // Test route – triggers a Sentry-captured exception for verification.
  // This endpoint should be removed or protected in production.
  // ---------------------------------------------------------------------
  app.get("/sentry-test", (req, res, next) => {
    // Throwing an error will be caught by Sentry's error handler.
    // The error handler will capture the exception and attach an event ID.
    // We simply pass the error to the next middleware.
    const err = new Error("Test Sentry exception");
    next(err);
  });

// Sentry error handling middleware – must be registered before custom error handler
app.use(Sentry.Handlers.errorHandler());
// Global error handler — must be registered LAST
app.use(errorHandler);

// Swagger UI setup
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../docs/openapi.json");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
