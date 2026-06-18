const { test, before, after, describe } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const app = require("../src/app");
const pool = require("../src/db");

let token = "";
let userId;
const noteIds = [];

before(async () => {
  // create user and get token
  const email = `pagination.${Date.now()}@example.com`;
  const password = "Secret123!";
  await request(app).post("/api/v1/auth/signup").send({ name: "Pagination User", email, password });
  const loginRes = await request(app).post("/api/v1/auth/login").send({ email, password });
  token = loginRes.body.token;
  const meRes = await request(app).get("/api/v1/auth/me").set("Authorization", `Bearer ${token}`);
  userId = meRes.body.id;
  // create 25 notes
  for (let i = 1; i <= 25; i++) {
    const res = await request(app)
      .post("/api/v1/notes")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: `Note ${i}`, content: `Content ${i}` });
    noteIds.push(res.body.data.id);
  }
});

after(async () => {
  await pool.end();
});

describe("Pagination tests", () => {
  test("page 1 returns first 5 notes", async () => {
    const res = await request(app)
      .get("/api/v1/notes?page=1&limit=5")
      .set("Authorization", `Bearer ${token}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.data.page, 1);
    assert.equal(res.body.data.limit, 5);
    assert.equal(res.body.data.total, 25);
    assert.equal(res.body.data.data.length, 5);
    assert.deepEqual(res.body.data.data.map(n => n.title), ["Note 1", "Note 2", "Note 3", "Note 4", "Note 5"]);
  });

  test("page 2 returns next 5 notes", async () => {
    const res = await request(app)
      .get("/api/v1/notes?page=2&limit=5")
      .set("Authorization", `Bearer ${token}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.data.page, 2);
    assert.equal(res.body.data.limit, 5);
    assert.equal(res.body.data.total, 25);
    assert.equal(res.body.data.data.length, 5);
    assert.deepEqual(res.body.data.data.map(n => n.title), ["Note 6", "Note 7", "Note 8", "Note 9", "Note 10"]);
  });

  test("invalid page 0 returns 400", async () => {
    const res = await request(app)
      .get("/api/v1/notes?page=0&limit=5")
      .set("Authorization", `Bearer ${token}`);
    assert.equal(res.status, 400);
  });

  test("invalid page -1 returns 400", async () => {
    const res = await request(app)
      .get("/api/v1/notes?page=-1&limit=5")
      .set("Authorization", `Bearer ${token}`);
    assert.equal(res.status, 400);
  });

  test("invalid limit 0 returns 400", async () => {
    const res = await request(app)
      .get("/api/v1/notes?page=1&limit=0")
      .set("Authorization", `Bearer ${token}`);
    assert.equal(res.status, 400);
  });

  test("invalid limit 101 returns 400", async () => {
    const res = await request(app)
      .get("/api/v1/notes?page=1&limit=101")
      .set("Authorization", `Bearer ${token}`);
    assert.equal(res.status, 400);
  });
});
