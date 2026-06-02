require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const app = require("../src/app");
const pool = require("../src/db");

const email = `test.${Date.now()}@example.com`;
const password = "secret123";
let token = "";

before(async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET missing — copy backend/.env.example to backend/.env");
  }
});

after(async () => {
  await pool.end();
});

test("POST /api/v1/auth/signup", async () => {
  const res = await request(app)
    .post("/api/v1/auth/signup")
    .send({ name: "Test User", email, password });

  assert.equal(res.status, 201);
  assert.ok(res.body.user?.id);
});

test("POST /api/v1/auth/login", async () => {
  const res = await request(app)
    .post("/api/v1/auth/login")
    .send({ email, password });

  assert.equal(res.status, 200);
  assert.ok(res.body.token);
  token = res.body.token;
});

test("GET /api/v1/auth/me", async () => {
  const res = await request(app)
    .get("/api/v1/auth/me")
    .set("Authorization", `Bearer ${token}`);

  assert.equal(res.status, 200);
  assert.equal(res.body.email, email);
});

test("tags and notes flow", async () => {
  const tagRes = await request(app)
    .post("/api/v1/tags")
    .set("Authorization", `Bearer ${token}`)
    .send({ name: `tag-${Date.now()}` });

  assert.equal(tagRes.status, 201);
  const tagId = tagRes.body.data.id;

  const noteRes = await request(app)
    .post("/api/v1/notes")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Smoke test note",
      content: "Hello",
      tagIds: [tagId],
    });

  assert.equal(noteRes.status, 201);
  const noteId = noteRes.body.data.id;

  const listRes = await request(app)
    .get("/api/v1/notes")
    .set("Authorization", `Bearer ${token}`);

  assert.equal(listRes.status, 200);
  assert.ok(listRes.body.data.some((n) => n.id === noteId));

  const delTagRes = await request(app)
    .delete(`/api/v1/tags/${tagId}`)
    .set("Authorization", `Bearer ${token}`);

  assert.equal(delTagRes.status, 200);
});
