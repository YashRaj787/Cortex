// Temporary script to query current indexes in the public schema
require('../src/config/env');
const { Pool } = require('pg');
const getPoolConfig = require('../src/db/config');

async function main() {
  const poolConfig = getPoolConfig();
  const pool = new Pool(poolConfig);
  try {
    const res = await pool.query(
      "SELECT indexname, indexdef FROM pg_indexes WHERE schemaname='public';"
    );
    console.log('Current indexes:');
    res.rows.forEach(row => {
      console.log(`${row.indexname}: ${row.indexdef}`);
    });
  } catch (err) {
    console.error('Error querying indexes:', err.message);
  } finally {
    await pool.end();
  }
}

main();