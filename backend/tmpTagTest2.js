require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const request = require('supertest');
const app = require('./src/app');

(async () => {
  const email = `tmp2.${Date.now()}@example.com`;
  const password = 'secret123';
  // signup
  await request(app).post('/api/v1/auth/signup').send({ name: 'Tmp2', email, password });
  // login
  const loginRes = await request(app).post('/api/v1/auth/login').send({ email, password });
  const token = loginRes.body.token;
  console.log('Token length', token?.length);
  // create tag
  const tagRes = await request(app)
    .post('/api/v1/tags')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: `tag-${Date.now()}` });
  console.log('Tag status', tagRes.status);
  console.log('Tag body', tagRes.body);
})();