const request = require('supertest');
const app = require('../src/app');

request(app)
  .get('/docs-json')
  .expect(404)
  .end((err, res) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log('Docs-json status', res.status);
  });