const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:rajput@localhost:5432/cortex_test' });

async function run() {
  try {
    const queries = [
      {
        name: 'user lookup by email',
        sql: `EXPLAIN ANALYZE SELECT * FROM users WHERE email = $1`,
        params: ['test@example.com'],
      },
      {
        name: 'notes list by user_id ordered by updated_at',
        sql: `EXPLAIN ANALYZE SELECT id, title, content, folder_id, created_at, updated_at FROM notes WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 10 OFFSET 0`,
        params: [1],
      },
    ];
    for (const q of queries) {
      const res = await pool.query(q.sql, q.params);
      console.log(`\n=== ${q.name} ===`);
      console.log(res.rows.map(r => r['QUERY PLAN']).join('\n'));
    }
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

run();