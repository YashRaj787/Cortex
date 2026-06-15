require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const { test, before, after, describe } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const app = require("../src/app");
const pool = require("../src/db");

let token = "";
const email = `test.folders.${Date.now()}@example.com`;
const password = "Secret123!";
let folderId = null;

before(async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET missing — copy backend/.env.example to backend/.env");
  }
  // create user and obtain token
  await request(app).post("/api/v1/auth/signup").send({ name: "Folder User", email, password });
  const loginRes = await request(app).post("/api/v1/auth/login").send({ email, password });
  token = loginRes.body.token;
});

after(async () => {
  await pool.end();
});

describe("Folders integration tests", () => {
  test("POST /api/v1/folders - unauthorized", async () => {
    const res = await request(app).post("/api/v1/folders").send({ name: "NoAuth" });
    assert.equal(res.status, 401);
  });

  test("POST /api/v1/folders - success", async () => {
    const res = await request(app)
      .post("/api/v1/folders")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Folder" });
    assert.equal(res.status, 201);
    assert.ok(res.body.data?.id);
    folderId = res.body.data.id;
  });

  test("PUT /api/v1/folders/:id - success", async () => {
    const res = await request(app)
      .put(`/api/v1/folders/${folderId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated Folder" });
    assert.equal(res.status, 200);
    assert.equal(res.body.data?.name, "Updated Folder");
  });

  test("GET /api/v1/folders - authorized list includes created", async () => {
    const res = await request(app)
      .get("/api/v1/folders")
      .set("Authorization", `Bearer ${token}`);
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.some((f) => f.id === folderId));
  });

  test("DELETE /api/v1/folders/:id - success", async () => {
    const res = await request(app)
      .delete(`/api/v1/folders/${folderId}`)
      .set("Authorization", `Bearer ${token}`);
    assert.equal(res.status, 200);
  });
});
