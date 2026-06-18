// Utility to drop the test database if it exists
require('../src/config/env');
const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:rajput@localhost:5432/postgres' });
async function drop() {
  try {
    await client.connect();
    await client.query('DROP DATABASE IF EXISTS cortex_test');
    console.log('Dropped cortex_test database');
  } catch (err) {
    console.error('Error dropping database:', err.message);
  } finally {
    await client.end();
  }
}
drop();