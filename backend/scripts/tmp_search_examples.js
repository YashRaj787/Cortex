const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:rajput@localhost:5432/cortex_test' });

async function run() {
  const terms = ['docker', 'postgres', 'authentication'];
  for (const term of terms) {
    const res = await pool.query(
      `SELECT id, title, content FROM notes WHERE user_id = $1 AND to_tsvector('english', title || ' ' || content) @@ plainto_tsquery('english', $2) ORDER BY updated_at DESC LIMIT 5`,
      [1, term]
    );
    console.log(`\n=== Results for '${term}' ===`);
    console.table(res.rows);
  }
  await pool.end();
}

run();