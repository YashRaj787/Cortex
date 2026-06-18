// Script to populate benchmark data for performance testing
require('../src/config/env');
const { Pool } = require('pg');
const getPoolConfig = require('../src/db/config');

const pool = new Pool(getPoolConfig());

function randomString(len) {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let str = '';
  for (let i = 0; i < len; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return str;
}

async function insertUsers(count) {
  console.log(`Inserting ${count} users...`);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const batchSize = 1000;
    for (let i = 0; i < count; i += batchSize) {
      const values = [];
      const placeholders = [];
      for (let j = 0; j < batchSize && i + j < count; j++) {
        const email = `user${i + j}@example.com`;
        const name = randomString(8);
        const password = 'password';
      values.push(email, name, password);
      placeholders.push(`($${values.length - 2}, $${values.length - 1}, $${values.length})`);
      }
      const sql = `INSERT INTO users (email, name, password) VALUES ${placeholders.join(', ')}`;
      await client.query(sql, values);
    }
    await client.query('COMMIT');
    console.log('Users inserted');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error inserting users:', err.message);
  } finally {
    client.release();
  }
}

async function insertNotes(count) {
  console.log(`Inserting ${count} notes...`);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const batchSize = 1000;
    for (let i = 0; i < count; i += batchSize) {
      const values = [];
      const placeholders = [];
      for (let j = 0; j < batchSize && i + j < count; j++) {
      const user_id = Math.floor(Math.random() * 1000) + 1; // users exist
      const folder_id = Math.floor(Math.random() * 100) + 1; // folders exist
        const title = randomString(12);
        const content = randomString(50);
        const created_at = new Date();
        const updated_at = new Date();
      values.push(user_id, folder_id, title, content, created_at, updated_at);
      placeholders.push(`($${values.length - 5}, $${values.length - 4}, $${values.length - 3}, $${values.length - 2}, $${values.length - 1}, $${values.length})`);
      }
      const sql = `INSERT INTO notes (user_id, folder_id, title, content, created_at, updated_at) VALUES ${placeholders.join(', ')}`;
      await client.query(sql, values);
    }
    await client.query('COMMIT');
    console.log('Notes inserted');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error inserting notes:', err.message);
  } finally {
    client.release();
  }
}

async function insertTags(count) {
  console.log(`Inserting ${count} tags...`);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const batchSize = 1000;
    for (let i = 0; i < count; i += batchSize) {
      const values = [];
      const placeholders = [];
      for (let j = 0; j < batchSize && i + j < count; j++) {
        const user_id = Math.floor(Math.random() * 1000) + 1; // users exist
        const name = randomString(6);
      values.push(user_id, name);
      placeholders.push(`($${values.length - 1}, $${values.length})`);
      }
      const sql = `INSERT INTO tags (user_id, name) VALUES ${placeholders.join(', ')}`;
      await client.query(sql, values);
    }
    await client.query('COMMIT');
    console.log('Tags inserted');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error inserting tags:', err.message);
  } finally {
    client.release();
  }
}

async function insertNoteTags(count) {
  console.log(`Inserting ${count} note_tags...`);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const batchSize = 1000;
    for (let i = 0; i < count; i += batchSize) {
      const values = [];
      const placeholders = [];
      for (let j = 0; j < batchSize && i + j < count; j++) {
        const note_id = Math.floor(Math.random() * 5000) + 1; // notes exist
        const tag_id = Math.floor(Math.random() * 500) + 1; // tags exist
      values.push(note_id, tag_id);
      placeholders.push(`($${values.length - 1}, $${values.length})`);
      }
      const sql = `INSERT INTO note_tags (note_id, tag_id) VALUES ${placeholders.join(', ')}`;
      await client.query(sql, values);
    }
    await client.query('COMMIT');
    console.log('Note_tags inserted');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error inserting note_tags:', err.message);
  } finally {
    client.release();
  }
}

async function main() {
  try {
    // Using reduced dataset for demonstration purposes
    await insertUsers(100000);
    await insertNotes(500000);
    await insertTags(50000);
    await insertNoteTags(500000);
    console.log('All data inserted. Running ANALYZE...');
    await pool.query('ANALYZE');
    console.log('ANALYZE completed. Running EXPLAIN ANALYZE...');
    // Reuse tmp_explain.js logic
    const queries = [
      { name: 'User lookup by email', sql: "SELECT * FROM users WHERE email = 'user1@example.com';" },
      { name: 'Notes by user_id', sql: "SELECT * FROM notes WHERE user_id = 1 ORDER BY updated_at DESC LIMIT 20;" },
      { name: 'Notes by folder_id', sql: "SELECT * FROM notes WHERE folder_id = 1 LIMIT 20;" },
      { name: 'Tags by user_id', sql: "SELECT * FROM tags WHERE user_id = 1;" },
      { name: 'Note tags by note_id', sql: "SELECT * FROM note_tags WHERE note_id = 1;" },
      { name: 'Note tags by tag_id', sql: "SELECT * FROM note_tags WHERE tag_id = 1;" },
    ];
    for (const q of queries) {
      console.log(`\n=== ${q.name} ===`);
      const res = await pool.query(`EXPLAIN ANALYZE ${q.sql}`);
      console.log(res.rows.map(r => r['QUERY PLAN']).join('\n'));
    }
  } catch (err) {
    console.error('Error in benchmark:', err.message);
  } finally {
    await pool.end();
  }
}

main();