require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const { test, before, after, describe } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const app = require("../src/app");
const pool = require("../src/db");

let token = "";
const email = `test.tags.${Date.now()}@example.com`;
const password = "Secret123!";
let tagId = null;

before(async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET missing — copy backend/.env.example to backend/.env");
  }
  await request(app).post("/api/v1/auth/signup").send({ name: "Tag User", email, password });
  const loginRes = await request(app).post("/api/v1/auth/login").send({ email, password });
  token = loginRes.body.token;
});

after(async () => {
  await pool.end();
});

describe("Tags integration tests", () => {
  test("POST /api/v1/tags - unauthorized", async () => {
    const res = await request(app).post("/api/v1/tags").send({ name: "NoAuth" });
    assert.equal(res.status, 401);
  });

  test("POST /api/v1/tags - success", async () => {
    const res = await request(app)
      .post("/api/v1/tags")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Tag" });
    assert.equal(res.status, 201);
    assert.ok(res.body.data?.id);
    tagId = res.body.data.id;
  });

  test("DELETE /api/v1/tags/:id - success", async () => {
    const res = await request(app)
      .delete(`/api/v1/tags/${tagId}`)
      .set("Authorization", `Bearer ${token}`);
    assert.equal(res.status, 200);
  });
});
