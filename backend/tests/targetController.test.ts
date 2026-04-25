import { describe, it, expect, beforeEach, jest } from "@jest/globals";

const mockTarget = {
  findMany: jest.fn<() => Promise<object[]>>(),
  findUniqueOrThrow: jest.fn<() => Promise<object | null>>(),
  findFirst: jest.fn<() => Promise<object | null>>(),
  createManyAndReturn: jest.fn<() => Promise<object[]>>(),
  delete: jest.fn<() => Promise<object>>(),
};

const mockPage = {
  createManyAndReturn: jest.fn<() => Promise<object[]>>(),
};

jest.unstable_mockModule("../generated/prisma/client.js", () => ({
  PrismaClient: jest.fn(() => ({ target: mockTarget, page: mockPage })),
}));

const { default: app } = await import("../app.js");
const { SECRET, setupEnv } = await import("./helpers.js");
const { default: request } = await import("supertest");
const { default: jwt } = await import("jsonwebtoken");

function authToken(): string {
  return jwt.sign({ actorType: "user", username: "admin" }, SECRET);
}

function workerAuthToken(): string {
  return jwt.sign({ actorType: "worker", workerId: "worker" }, SECRET);
}

beforeEach(() => {
  setupEnv();
  mockTarget.findMany.mockReset();
  mockTarget.findFirst.mockReset();
  mockTarget.createManyAndReturn.mockReset();
  mockTarget.delete.mockReset();
  mockPage.createManyAndReturn.mockReset();
});

const target = {
  id: 1,
  domain: "https://example.com",
  disabled: false,
};

const pages = [
  { url: "https://example.com" },
  { url: "https://example.com/blog/1" },
  { url: "https://example.com/blog/1" },
];

const returnedPages = pages.map((p, i) => ({
  ...p,
  id: i,
  targetId: 1,
}));

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

  it("responds with 400 when domain is not a valid URL", async () => {
    const res = await request(app)
      .post("/api/targets")
      .set("Authorization", `Bearer ${authToken()}`)
      .send({ targets: [{ domain: "example.com" }] });
    expect(res.status).toBe(400);
  });

  it("responds with 201 and the created targets", async () => {
    mockTarget.createManyAndReturn.mockResolvedValue([target]);

    const res = await request(app)
      .post("/api/targets")
      .set("Authorization", `Bearer ${authToken()}`)
      .send({ targets: [{ domain: "https://example.com" }] });

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

describe("POST /api/targets/:id/pages", () => {
  it("responds with 201 and the created pages", async () => {
    mockTarget.findUniqueOrThrow.mockResolvedValue(target);
    mockPage.createManyAndReturn.mockResolvedValue(returnedPages);

    const res = await request(app)
      .post("/api/targets/1/pages")
      .set("Authorization", `Bearer ${workerAuthToken()}`)
      .send({ pages });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(returnedPages);
  });

  it("responds with 403 when using invalid token", async () => {
    const res = await request(app)
      .post("/api/targets/1/pages")
      .set("Authorization", `Bearer ${authToken()}`)
      .send({ pages });

    expect(res.status).toBe(403);
  });
});
