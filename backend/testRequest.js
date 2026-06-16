// testRequest.js
// Simple script to start the server and make a request to /health
// to demonstrate the request logging middleware.

const http = require("http");
// Importing server.js will start the server.
require("./server");

// Wait a bit for the server to start listening
setTimeout(() => {
  http.get("http://localhost:3000/health", (res) => {
    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });
    res.on("end", () => {
      console.log("Response received:", data);
      // Exit after a short delay to allow logger to flush
      setTimeout(() => process.exit(0), 500);
    });
  }).on("error", (err) => {
    console.error("Request error:", err);
    process.exit(1);
  });
}, 2000);
