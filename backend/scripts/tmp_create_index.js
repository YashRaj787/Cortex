const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:rajput@localhost:5432/cortex_test' });

async function run() {
  try {
    const res = await pool.query(`CREATE INDEX IF NOT EXISTS idx_notes_tsvector ON notes USING GIN (to_tsvector('english', title || ' ' || content));`);
    console.log('Index creation result:', res.command);
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await pool.end();
  }
}

run();