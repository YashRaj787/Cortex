const request = require('supertest');
const app = require('./src/app');

(async () => {
  const email = `tmp.${Date.now()}@example.com`;
  const password = 'secret123';
  // signup
  await request(app).post('/api/v1/auth/signup').send({ name: 'Tmp', email, password });
  // login
  const loginRes = await request(app).post('/api/v1/auth/login').send({ email, password });
  const token = loginRes.body.token;
  console.log('Token obtained');
  // create tag
  const tagRes = await request(app)
    .post('/api/v1/tags')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: `tag-${Date.now()}` });
  console.log('Tag response status:', tagRes.status);
  console.log('Tag response body:', tagRes.body);
})();