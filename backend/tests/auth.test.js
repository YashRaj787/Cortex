require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const { test, before, after, describe } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const app = require("../src/app");
const pool = require("../src/db");

let token = "";
const email = `test.auth.${Date.now()}@example.com`;
const password = "Secret123!";

before(async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET missing — copy backend/.env.example to backend/.env");
  }
});

after(async () => {
  await pool.end();
});

describe("Auth integration tests", () => {
  test("POST /api/v1/auth/signup - success", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({ name: "Auth User", email, password });
    assert.equal(res.status, 201);
    assert.ok(res.body.user?.id);
  });

  test("POST /api/v1/auth/signup - fail (duplicate email)", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({ name: "Auth User", email, password });
    // Assuming the API returns 400 for duplicate
    assert.equal(res.status, 400);
  });

  test("POST /api/v1/auth/login - success", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email, password });
    assert.equal(res.status, 200);
    assert.ok(res.body.token);
    token = res.body.token;
  });

  test("POST /api/v1/auth/login - fail (wrong password)", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email, password: "wrong" });
    assert.equal(res.status, 401);
  });

  test("GET /api/v1/auth/me - unauthorized", async () => {
    const res = await request(app).get("/api/v1/auth/me");
    assert.equal(res.status, 401);
  });

  test("GET /api/v1/auth/me - authorized", async () => {
    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${token}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.email, email);
  });
});
