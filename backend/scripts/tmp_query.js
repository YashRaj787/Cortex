const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:rajput@localhost:5432/cortex_test' });

async function run() {
  try {
    const res = await pool.query("SELECT tablename, indexname, indexdef FROM pg_indexes WHERE schemaname='public' AND tablename IN ('users','notes','tags','note_tags')");
    console.log('Indexes:');
    console.table(res.rows);
    const explain = await pool.query("EXPLAIN SELECT id, title, content, folder_id, created_at, updated_at FROM notes WHERE user_id = 1 ORDER BY updated_at DESC LIMIT 10 OFFSET 0");
    console.log('Explain:');
    console.log(explain.rows.map(r => r['QUERY PLAN']).join('\n'));
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

run();