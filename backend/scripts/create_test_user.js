/**
 * Create the test_user role (if it does not exist) with a known password.
 * This script is used before running the test suite.
 */
require('dotenv').config({ path: __dirname + '/../.env' });
const { Client } = require('pg');

// Connect as the superuser defined in .env (DB_USER/DB_PASSWORD)
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: 'postgres', // connect to default db to create role
});

async function ensureTestUser() {
  try {
    await client.connect();
    // Create role if it does not exist
    await client.query(
      `DO $$
       BEGIN
         IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'test_user') THEN
           CREATE ROLE test_user WITH LOGIN PASSWORD 'testpass';
         END IF;
       END $$;`
    );
    console.log('test_user role ensured');
  } catch (err) {
    console.error('Error creating test_user role:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

ensureTestUser();