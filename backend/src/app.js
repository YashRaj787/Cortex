const express = require("express");
const cors = require("cors");

const app = express();

const authRoutes = require("./routes/authRoutes");
const notesRoutes = require("./routes/notesRoutes");
const foldersRoutes = require("./routes/foldersRoutes");
const tagsRoutes = require("./routes/tagsRoutes");

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
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

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "cortex-api" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/notes", notesRoutes);
app.use("/api/v1/folders", foldersRoutes);
app.use("/api/v1/tags", tagsRoutes);

app.get("/", (req, res) => {
  res.send("Cortex API running");
});

module.exports = app;
