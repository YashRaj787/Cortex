// Simple smoke test for the summarize feature and basic note CRUD
const http = require('http');
const BASE_URL = 'http://localhost:3000';

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(data && { 'Content-Length': Buffer.byteLength(data) }),
        ...(token && { Authorization: `Bearer ${token}` })
      }
    };
    const req = http.request(options, (res) => {
      let resp = '';
      res.on('data', (chunk) => resp += chunk);
        res.on('end', () => {
          try { resolve({ status: res.statusCode, body: JSON.parse(resp) }); }
          catch { resolve({ status: res.statusCode, body: resp }); }
        });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function run() {
  console.log('=== SMOKE TEST START ===');
  // 1. Signup
  const signup = await request('POST', '/api/v1/auth/signup', { name: 'Smoke', email: 'smoke@test.com', password: 'pwd123' });
  console.log('Signup status', signup.status);
  // 2. Login
  const login = await request('POST', '/api/v1/auth/login', { email: 'smoke@test.com', password: 'pwd123' });
  console.log('Login status', login.status);
  const token = login.body && (login.body.token || login.body.accessToken);
  // 3. Create note
  const note = await request('POST', '/api/v1/notes', { title: 'Test', content: 'Hello world' }, token);
  console.log('Create note status', note.status);
  const noteId = note.body && note.body.data && note.body.data.id;
  // 4. Open note
  const get = await request('GET', `/api/v1/notes/${noteId}`, null, token);
  console.log('Get note status', get.status);
  // 5. Summarize note
  const sum = await request('POST', `/api/v1/notes/${noteId}/summarize`, null, token);
  console.log('Summarize status', sum.status);
  // 6. Edit note
  const edit = await request('PUT', `/api/v1/notes/${noteId}`, { title: 'Edited', content: 'Changed content' }, token);
  console.log('Edit status', edit.status);
  // 7. Delete note
  const del = await request('DELETE', `/api/v1/notes/${noteId}`, null, token);
  console.log('Delete status', del.status);
  console.log('=== SMOKE TEST END ===');
}

run().catch(err => console.error('SMOKE_ERROR', err));
