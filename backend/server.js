require("dotenv").config();

const app = require("./src/app");
const pool = require("./src/db");
const { checkDatabaseConnection } = pool;

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await checkDatabaseConnection();
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Database connection failed", err);
    await pool.end();
    process.exitCode = 1;
  }
}

startServer();
