const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const requestLogger = require("./middleware/requestLogger");
const config = require("./config");

const app = express();
// Apply Helmet middleware globally to set secure HTTP headers
app.use(helmet());

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

// Global error handler — must be registered LAST
app.use(errorHandler);

// Swagger UI setup
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../docs/openapi.json");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
