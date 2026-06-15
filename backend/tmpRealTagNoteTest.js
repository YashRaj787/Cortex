// Script to verify tag‑ownership validation against a real PostgreSQL instance
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

// Force production mode so the app uses the real DB (not pg‑mem)
process.env.NODE_ENV = 'production';

const request = require('supertest');
const app = require('./src/app');
const jwt = require('jsonwebtoken');

(async () => {
  const email = `realtest.${Date.now()}@example.com`;
  const password = 'realSecret123';

  // 1. Sign up
  const signupRes = await request(app)
    .post('/api/v1/auth/signup')
    .send({ name: 'Real Test', email, password });
  console.log('Signup status:', signupRes.status);

  // 2. Login
  const loginRes = await request(app)
    .post('/api/v1/auth/login')
    .send({ email, password });
  console.log('Login status:', loginRes.status);
  const token = loginRes.body.token;

  // Decode JWT to show user id
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log('Decoded JWT payload:', JSON.stringify(decoded));

  // 3. Create a tag
  const tagRes = await request(app)
    .post('/api/v1/tags')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: `real-tag-${Date.now()}` });
  console.log('Tag creation status:', tagRes.status);
  console.log('Tag creation body:', JSON.stringify(tagRes.body));
  const tagId = tagRes.body.data.id;

  // 4. Create a note referencing the tag
  const noteRes = await request(app)
    .post('/api/v1/notes')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Real note', content: 'Hello', tagIds: [tagId] });
  console.log('Note creation status:', noteRes.status);
  console.log('Note creation body:', JSON.stringify(noteRes.body));
})();
