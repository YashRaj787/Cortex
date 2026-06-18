const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:rajput@localhost:5432/cortex_test' });

async function run() {
  try {
    const res = await pool.query('SELECT * FROM schema_migrations');
    console.log('schema_migrations:', res.rows);
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

run();