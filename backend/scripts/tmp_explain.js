// Temporary script to run EXPLAIN ANALYZE for specific queries
require('../src/config/env');
const { Pool } = require('pg');
const getPoolConfig = require('../src/db/config');

const queries = [
  {
    name: 'User lookup by email',
    sql: "SELECT * FROM users WHERE email = 'test@example.com';",
  },
  {
    name: 'Notes by user_id',
    sql: "SELECT * FROM notes WHERE user_id = 1 ORDER BY updated_at DESC LIMIT 20;",
  },
  {
    name: 'Notes by folder_id',
    sql: "SELECT * FROM notes WHERE folder_id = 1 LIMIT 20;",
  },
  {
    name: 'Tags by user_id',
    sql: "SELECT * FROM tags WHERE user_id = 1;",
  },
  {
    name: 'Note tags by note_id',
    sql: "SELECT * FROM note_tags WHERE note_id = 1;",
  },
  {
    name: 'Note tags by tag_id',
    sql: "SELECT * FROM note_tags WHERE tag_id = 1;",
  },
];

async function main() {
  const pool = new Pool(getPoolConfig());
  try {
    for (const q of queries) {
      console.log(`\n=== ${q.name} ===`);
      const res = await pool.query(`EXPLAIN ANALYZE ${q.sql}`);
      console.log(res.rows.map(r => r['QUERY PLAN']).join('\n'));
    }
  } catch (err) {
    console.error('Error running explain:', err.message);
  } finally {
    await pool.end();
  }
}

main();