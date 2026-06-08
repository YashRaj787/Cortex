const { Pool } = require("pg");
const getPoolConfig = require("./config");

const pool = new Pool(getPoolConfig());

async function checkDatabaseConnection() {
  await pool.query("SELECT 1");
}

module.exports = pool;
module.exports.checkDatabaseConnection = checkDatabaseConnection;

