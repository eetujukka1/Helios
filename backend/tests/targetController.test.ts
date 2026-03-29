import { describe, it, expect, beforeEach, jest } from "@jest/globals";

const mockTarget = {
  findMany: jest.fn<() => Promise<object[]>>(),
  findFirst: jest.fn<() => Promise<object | null>>(),
  createManyAndReturn: jest.fn<() => Promise<object[]>>(),
  delete: jest.fn<() => Promise<object>>(),
};

jest.unstable_mockModule("../generated/prisma/client.js", () => ({
  PrismaClient: jest.fn(() => ({ target: mockTarget })),
}));

const { default: app } = await import("../app.js");
const { SECRET, setupEnv } = await import("./helpers.js");
const { default: request } = await import("supertest");
const { default: jwt } = await import("jsonwebtoken");

function authToken(): string {
  return jwt.sign({ username: "admin" }, SECRET);
}

beforeEach(() => {
  setupEnv();
  mockTarget.findMany.mockReset();
  mockTarget.findFirst.mockReset();
  mockTarget.createManyAndReturn.mockReset();
  mockTarget.delete.mockReset();
});

const target = {
  id: 1,
  domain: "example.com",
  disabled: false,
};

describe("GET /api/targets", () => {
  it("responds with 401 when no token provided", async () => {
    const res = await request(app).get("/api/targets");
    expect(res.status).toBe(401);
  });

  it("responds with 403 on invalid token", async () => {
    const res = await request(app)
      .get("/api/targets")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.status).toBe(403);
  });

  it("responds with 200 and an array of targets", async () => {
    mockTarget.findMany.mockResolvedValue([target]);

    const res = await request(app)
      .get("/api/targets")
      .set("Authorization", `Bearer ${authToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([target]);
  });

  it("responds with 200 and empty array when no targets exist", async () => {
    mockTarget.findMany.mockResolvedValue([]);

    const res = await request(app)
      .get("/api/targets")
      .set("Authorization", `Bearer ${authToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe("GET /api/targets/:id", () => {
  it("responds with 401 when no token provided", async () => {
    const res = await request(app).get("/api/targets/1");
    expect(res.status).toBe(401);
  });

  it("responds with 403 on invalid token", async () => {
    const res = await request(app)
      .get("/api/targets/1")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.status).toBe(403);
  });

  it("responds with 400 on non-numeric id", async () => {
    const res = await request(app)
      .get("/api/targets/abc")
      .set("Authorization", `Bearer ${authToken()}`);
    expect(res.status).toBe(400);
  });

  it("responds with 200 and the target", async () => {
    mockTarget.findFirst.mockResolvedValue(target);

    const res = await request(app)
      .get("/api/targets/1")
      .set("Authorization", `Bearer ${authToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(target);
  });

  it("responds with 200 and null when target not found", async () => {
    mockTarget.findFirst.mockResolvedValue(null);

    const res = await request(app)
      .get("/api/targets/1")
      .set("Authorization", `Bearer ${authToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeNull();
  });
});

describe("POST /api/targets", () => {
  it("responds with 401 when no token provided", async () => {
    const res = await request(app).post("/api/targets");
    expect(res.status).toBe(401);
  });

  it("responds with 403 on invalid token", async () => {
    const res = await request(app)
      .post("/api/targets")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.status).toBe(403);
  });

  it("responds with 400 on invalid body", async () => {
    const res = await request(app)
      .post("/api/targets")
      .set("Authorization", `Bearer ${authToken()}`)
      .send({ targets: [{ invalid: "data" }] });
    expect(res.status).toBe(400);
  });

  it("responds with 400 when domain is empty string", async () => {
    const res = await request(app)
      .post("/api/targets")
      .set("Authorization", `Bearer ${authToken()}`)
      .send({ targets: [{ domain: "" }] });
    expect(res.status).toBe(400);
  });

  it("responds with 201 and the created targets", async () => {
    mockTarget.createManyAndReturn.mockResolvedValue([target]);

    const res = await request(app)
      .post("/api/targets")
      .set("Authorization", `Bearer ${authToken()}`)
      .send({ targets: [{ domain: "example.com" }] });

    expect(res.status).toBe(201);
    expect(res.body).toEqual([target]);
  });
});

describe("DELETE /api/targets/:id", () => {
  it("responds with 401 when no token provided", async () => {
    const res = await request(app).delete("/api/targets/1");
    expect(res.status).toBe(401);
  });

  it("responds with 403 on invalid token", async () => {
    const res = await request(app)
      .delete("/api/targets/1")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.status).toBe(403);
  });

  it("responds with 400 on non-numeric id", async () => {
    const res = await request(app)
      .delete("/api/targets/abc")
      .set("Authorization", `Bearer ${authToken()}`);
    expect(res.status).toBe(400);
  });

  it("responds with 200 and the deleted target", async () => {
    mockTarget.delete.mockResolvedValue(target);

    const res = await request(app)
      .delete("/api/targets/1")
      .set("Authorization", `Bearer ${authToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(target);
  });
});
