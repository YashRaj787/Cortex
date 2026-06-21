const http = require('http');

const BASE_URL = 'http://localhost:3000';

function makeRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const url = new URL(path, BASE_URL);
    
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: JSON.parse(responseData)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: responseData
          });
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runAuthTest() {
  console.log('=== AUTH END-TO-END TEST ===\n');

  // Step 1: Signup
  console.log('1. SIGNUP REQUEST');
  console.log('URL:', `${BASE_URL}/api/v1/auth/signup`);
  console.log('Payload:', JSON.stringify({
    name: 'Test User',
    email: 'testuser999@example.com',
    password: 'test123'
  }, null, 2));
  console.log('');

  const signupResult = await makeRequest('POST', '/api/v1/auth/signup', {
    name: 'Test User',
    email: 'testuser999@example.com',
    password: 'test123'
  });

  console.log('HTTP STATUS:', signupResult.status);
  console.log('RESPONSE BODY:', JSON.stringify(signupResult.body, null, 2));
  console.log('');

  // Step 2: Login
  console.log('2. LOGIN REQUEST');
  console.log('URL:', `${BASE_URL}/api/v1/auth/login`);
  console.log('Payload:', JSON.stringify({
    email: 'testuser999@example.com',
    password: 'test123'
  }, null, 2));
  console.log('');

  const loginResult = await makeRequest('POST', '/api/v1/auth/login', {
    email: 'testuser999@example.com',
    password: 'test123'
  });

  console.log('HTTP STATUS:', loginResult.status);
  console.log('RESPONSE BODY:', JSON.stringify(loginResult.body, null, 2));
  console.log('');

  // Check for JWT token
  const hasToken = loginResult.body && loginResult.body.token;
  const hasAccessToken = loginResult.body && loginResult.body.accessToken;
  const tokenField = loginResult.body ? Object.keys(loginResult.body).find(k => k.toLowerCase().includes('token')) : null;

  console.log('3. TOKEN ANALYSIS');
  console.log('Has "token" field:', hasToken);
  console.log('Has "accessToken" field:', hasAccessToken);
  console.log('Token field name:', tokenField);
  if (tokenField) {
    console.log('Token value (first 50 chars):', loginResult.body[tokenField]?.substring(0, 50) + '...');
  }
  console.log('');

  // Summary
  console.log('4. SUMMARY');
  console.log('Signup status:', signupResult.status === 201 || signupResult.status === 200 ? 'SUCCESS' : 'FAILED');
  console.log('Login status:', loginResult.status === 200 ? 'SUCCESS' : 'FAILED');
  console.log('JWT Token returned:', hasToken || hasAccessToken ? 'YES' : 'NO');
}

runAuthTest().catch(console.error);