const express = require("express");
const cors = require("cors");

const app = express();

const authRoutes = require("./routes/authRoutes");
const notesRoutes = require("./routes/notesRoutes");
const foldersRoutes = require("./routes/foldersRoutes");
const tagsRoutes = require("./routes/tagsRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      console.log("ORIGIN RAW:", JSON.stringify(origin));
      console.log("ORIGIN LENGTH:", origin?.length);

      allowedOrigins.forEach((o, i) => {
        console.log(`ALLOWED[${i}] RAW:`, JSON.stringify(o));
        console.log(`ALLOWED[${i}] LENGTH:`, o.length);
        console.log(`ALLOWED[${i}] === ORIGIN:`, o === origin);
      });

      console.log("MATCH:", allowedOrigins.includes(origin));
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

// Global error handler — must be registered LAST
app.use(errorHandler);

module.exports = app;
