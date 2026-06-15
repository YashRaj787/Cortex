require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const { test, before, after, describe } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const app = require("../src/app");
const pool = require("../src/db");

let token = "";
const email = `test.notes.${Date.now()}@example.com`;
const password = "Secret123!";
let noteId = null;

before(async () => {
  // Ensure JWT secret exists
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET missing — copy backend/.env.example to backend/.env");
  }
  // Sign up and login to obtain token for authorized tests
  await request(app)
    .post("/api/v1/auth/signup")
    .send({ name: "Notes User", email, password });
  const loginRes = await request(app)
    .post("/api/v1/auth/login")
    .send({ email, password });
  token = loginRes.body.token;
});

after(async () => {
  await pool.end();
});

describe("Notes integration tests", () => {
  test("POST /api/v1/notes - unauthorized", async () => {
    const res = await request(app).post("/api/v1/notes").send({ title: "No Auth", content: "..." });
    assert.equal(res.status, 401);
  });

  test("POST /api/v1/notes - success", async () => {
    const res = await request(app)
      .post("/api/v1/notes")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test Note", content: "Hello World" });
    assert.equal(res.status, 201);
    assert.ok(res.body.data?.id);
    noteId = res.body.data.id;
  });

  test("PUT /api/v1/notes/:id - success", async () => {
    const res = await request(app)
      .put(`/api/v1/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Title", content: "Updated Content" });
    assert.equal(res.status, 200);
    assert.equal(res.body.data?.title, "Updated Title");
  });

  test("DELETE /api/v1/notes/:id - success", async () => {
    const res = await request(app)
      .delete(`/api/v1/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`);
    assert.equal(res.status, 200);
  });

  test("GET /api/v1/notes - unauthorized", async () => {
    const res = await request(app).get("/api/v1/notes");
    assert.equal(res.status, 401);
  });
});
