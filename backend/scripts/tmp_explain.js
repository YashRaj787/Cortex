const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:rajput@localhost:5432/cortex_test' });

async function run() {
  try {
    const queries = [
      {
        name: 'notes list',
        sql: `EXPLAIN SELECT id, title, content, folder_id, created_at, updated_at FROM notes WHERE user_id = 1 ORDER BY updated_at DESC LIMIT 10 OFFSET 0`,
      },
      {
        name: 'tags query',
        sql: `EXPLAIN SELECT id, name FROM tags WHERE user_id = 1 ORDER BY name ASC`,
      },
      {
        name: 'user lookup by email',
        sql: `EXPLAIN SELECT * FROM users WHERE email = 'test@example.com'`,
      },
    ];
    for (const q of queries) {
      const res = await pool.query(q.sql);
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