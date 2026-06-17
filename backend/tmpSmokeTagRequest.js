// Load environment variables via centralized env module
require('./src/config/env');
const request = require('supertest');
const app = require('./src/app');

(async () => {
  const email = `smoke.${Date.now()}@example.com`;
  const password = 'secret123';
  // signup
  await request(app).post('/api/v1/auth/signup').send({ name: 'Smoke', email, password });
  // login
  const loginRes = await request(app).post('/api/v1/auth/login').send({ email, password });
  const token = loginRes.body.token;
  // Decode JWT to get user id (payload contains id)
  const jwt = require('jsonwebtoken');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log('Decoded JWT payload:', JSON.stringify(decoded));
  // tag creation (the failing request)
  const tagRes = await request(app)
    .post('/api/v1/tags')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: `tag-${Date.now()}` });
  console.log('Tag creation status:', tagRes.status);
  console.log('Tag creation body:', JSON.stringify(tagRes.body));
  // Direct DB query to inspect the tag row
  // Use the same in‑memory pool used by the app (pg‑mem)
  const appPool = require('./src/db');
  const tagId = tagRes.body.data.id;
  const tagRow = await appPool.query('SELECT id, name, user_id FROM tags WHERE id = $1', [tagId]);
  console.log('DB tag row:', JSON.stringify(tagRow.rows[0]));
  // Verify user row directly using the same pool
  const userRow = await appPool.query('SELECT id FROM users WHERE id = $1', [decoded.id]);
  console.log('DB user row:', JSON.stringify(userRow.rows[0]));
  // Run the exact validation query used in notesService.validateTagIds
  const validationQuery = 'SELECT id FROM tags WHERE user_id = $1 AND id = ANY($2::int[])';
  const validationResult = await appPool.query(validationQuery, [decoded.id, [tagId]]);
  console.log('Validation query rows count:', validationResult.rows.length);
  console.log('Validation query rows:', JSON.stringify(validationResult.rows));
  // Attempt note creation (as in smoke test) to capture failure
  const noteRes = await request(app)
    .post('/api/v1/notes')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Smoke test note', content: 'Hello', tagIds: [tagRes.body.data.id] });
  console.log('Note creation status:', noteRes.status);
  console.log('Note creation body:', JSON.stringify(noteRes.body));
})();