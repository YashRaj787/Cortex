// Ensure JWT secret is defined for token generation and auth middleware verification
process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

const request = require('supertest');
const app = require('./src/app');
const jwt = require('jsonwebtoken');
// Create a dummy valid JWT for authenticated routes using the loaded secret
const dummyToken = jwt.sign({ id: 1, email: 'test@example.com' }, process.env.JWT_SECRET);
// Verify token to ensure it is valid (will throw if invalid)
try {
  jwt.verify(dummyToken, process.env.JWT_SECRET);
} catch (e) {
  console.error('Token verification failed', e);
}

async function runTests() {
  const results = {};

  // 1. Signup
  const signupValid = await request(app)
    .post('/api/v1/auth/signup')
    .send({ name: 'Test', email: 'test@example.com', password: 'secret123' });
  const signupInvalid = await request(app)
    .post('/api/v1/auth/signup')
    .send({ email: 'invalid', password: '123' }); // missing name, bad email, short pwd
  results.signup = { valid: { status: signupValid.status, body: signupValid.body }, invalid: { status: signupInvalid.status, body: signupInvalid.body } };

  // 2. Login
  const loginValid = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'test@example.com', password: 'secret123' });
  const loginInvalid = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'test@example.com' }); // missing password
  results.login = { valid: { status: loginValid.status, body: loginValid.body }, invalid: { status: loginInvalid.status, body: loginInvalid.body } };

  // 3. Create Note
  const noteValid = await request(app)
    .post('/api/v1/notes/')
    .set('Authorization', `Bearer ${dummyToken}`)
    .send({ title: 'Note', content: 'Some content' });
  const noteInvalid = await request(app)
    .post('/api/v1/notes/')
    .set('Authorization', `Bearer ${dummyToken}`)
    .send({ title: '' }); // title empty
  results.createNote = { valid: { status: noteValid.status, body: noteValid.body }, invalid: { status: noteInvalid.status, body: noteInvalid.body } };

  // 4. Update Note
  const updateValid = await request(app)
    .put('/api/v1/notes/1')
    .set('Authorization', `Bearer ${dummyToken}`)
    .send({ title: 'Updated' });
  const updateInvalid = await request(app)
    .put('/api/v1/notes/1')
    .set('Authorization', `Bearer ${dummyToken}`)
    .send({}); // empty body
  results.updateNote = { valid: { status: updateValid.status, body: updateValid.body }, invalid: { status: updateInvalid.status, body: updateInvalid.body } };

  // 5. Create Folder
  const folderValid = await request(app)
    .post('/api/v1/folders/')
    .set('Authorization', `Bearer ${dummyToken}`)
    .send({ name: 'MyFolder' });
  const folderInvalid = await request(app)
    .post('/api/v1/folders/')
    .set('Authorization', `Bearer ${dummyToken}`)
    .send({ name: '' });
  results.createFolder = { valid: { status: folderValid.status, body: folderValid.body }, invalid: { status: folderInvalid.status, body: folderInvalid.body } };

  // 6. Create Tag
  const tagValid = await request(app)
    .post('/api/v1/tags/')
    .set('Authorization', `Bearer ${dummyToken}`)
    .send({ name: 'Tag1' });
  const tagInvalid = await request(app)
    .post('/api/v1/tags/')
    .set('Authorization', `Bearer ${dummyToken}`)
    .send({ name: '' });
  results.createTag = { valid: { status: tagValid.status, body: tagValid.body }, invalid: { status: tagInvalid.status, body: tagInvalid.body } };

  console.log(JSON.stringify(results, null, 2));
}

runTests();
