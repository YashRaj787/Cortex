/**
 * Diagnostic script to monitor GET /api/v1/notes requests
 * Run: node diagnostic_test.js
 */

const http = require('http');

// Track request counts
let requestCount = 0;
const requestTimestamps = [];

// Create a proxy server that logs requests
const proxy = http.createServer((req, res) => {
  const url = req.url;
  
  if (url.includes('/api/v1/notes')) {
    requestCount++;
    const now = new Date().toISOString();
    requestTimestamps.push({ time: now, url, method: req.method });
    console.log(`[${now}] ${req.method} ${url} - Count: ${requestCount}`);
    
    // Forward to actual backend
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: url,
      method: req.method,
      headers: req.headers
    };
    
    const proxyReq = http.request(options, (proxyRes) => {
      let data = '';
      proxyRes.on('data', chunk => data += chunk);
      proxyRes.on('end', () => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        res.end(data);
      });
    });
    
    proxyReq.on('error', (e) => {
      console.error('Proxy error:', e.message);
      res.writeHead(502);
      res.end('Bad Gateway');
    });
    
    req.pipe(proxyReq);
  } else {
    // Forward other requests
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: url,
      method: req.method,
      headers: req.headers
    };
    
    const proxyReq = http.request(options, (proxyRes) => {
      let data = '';
      proxyRes.on('data', chunk => data += chunk);
      proxyRes.on('end', () => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        res.end(data);
      });
    });
    
    req.pipe(proxyReq);
  }
});

proxy.listen(3999, () => {
  console.log('Diagnostic proxy running on port 3999');
  console.log('Monitoring for /api/v1/notes requests...');
  console.log('');
});

// Print summary every 5 seconds
setInterval(() => {
  if (requestCount > 0) {
    console.log(`\n=== SUMMARY at ${new Date().toISOString()} ===`);
    console.log(`Total /api/v1/notes requests: ${requestCount}`);
    console.log(`Request timestamps:`);
    requestTimestamps.slice(-10).forEach(r => {
      console.log(`  ${r.time}: ${r.method} ${r.url}`);
    });
    console.log('');
  }
}, 5000);

// After 30 seconds, print final summary and exit
setTimeout(() => {
  console.log('\n=== FINAL DIAGNOSTIC SUMMARY ===');
  console.log(`Total /api/v1/notes requests: ${requestCount}`);
  console.log(`\nAll request timestamps:`);
  requestTimestamps.forEach(r => {
    console.log(`  ${r.time}: ${r.method} ${r.url}`);
  });
  
  if (requestTimestamps.length > 1) {
    // Calculate intervals between requests
    console.log(`\nIntervals between requests (ms):`);
    for (let i = 1; i < requestTimestamps.length; i++) {
      const t1 = new Date(requestTimestamps[i-1].time);
      const t2 = new Date(requestTimestamps[i].time);
      const interval = t2 - t1;
      console.log(`  #${i} -> #${i+1}: ${interval}ms`);
    }
  }
  
  proxy.close();
  process.exit(0);
}, 30000);