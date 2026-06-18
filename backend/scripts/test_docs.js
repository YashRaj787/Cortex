const request = require('supertest');
const app = require('../src/app');

request(app)
  .get('/docs')
  .expect(200)
  .end((err, res) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log('Docs status', res.status);
    console.log('Body snippet', res.text.slice(0, 200));
  });