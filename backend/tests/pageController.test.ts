import { describe, it, expect, beforeEach, jest } from "@jest/globals";

const mockPage = {
  findMany: jest.fn<() => Promise<object[]>>(),
  findFirst: jest.fn<() => Promise<object | null>>(),
};

jest.unstable_mockModule("../generated/prisma/client.js", () => ({
  PrismaClient: jest.fn(() => ({ page: mockPage })),
}));

const { default: app } = await import("../app.js");
const { SECRET, setupEnv } = await import("./helpers.js");
const { default: request } = await import("supertest");
const { default: jwt } = await import("jsonwebtoken");

function authToken(): string {
  return jwt.sign({ actorType: "user", username: "admin" }, SECRET);
}

beforeEach(() => {
  setupEnv();
  mockPage.findMany.mockReset();
  mockPage.findFirst.mockReset();
});

const page = {
  id: 1,
  host: "page.example.com",
  port: 8080,
  username: "user",
  password: "pass",
  enabled: true,
};

describe("GET /api/pages", () => {
  it("responds with 401 when no token provided", async () => {
    const res = await request(app).get("/api/pages");
    expect(res.status).toBe(401);
  });

  it("responds with 403 on invalid token", async () => {
    const res = await request(app)
      .get("/api/pages")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.status).toBe(403);
  });

  it("responds with 200 and an array of pages", async () => {
    mockPage.findMany.mockResolvedValue([page]);

    const res = await request(app)
      .get("/api/pages")
      .set("Authorization", `Bearer ${authToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([page]);
  });

  it("responds with 200 and empty array when no pages exist", async () => {
    mockPage.findMany.mockResolvedValue([]);

    const res = await request(app)
      .get("/api/pages")
      .set("Authorization", `Bearer ${authToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe("GET /api/pages/:id", () => {
  it("responds with 401 when no token provided", async () => {
    const res = await request(app).get("/api/pages/1");
    expect(res.status).toBe(401);
  });

  it("responds with 403 on invalid token", async () => {
    const res = await request(app)
      .get("/api/pages/1")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.status).toBe(403);
  });

  it("responds with 400 on non-numeric id", async () => {
    const res = await request(app)
      .get("/api/pages/abc")
      .set("Authorization", `Bearer ${authToken()}`);
    expect(res.status).toBe(400);
  });

  it("responds with 200 and the page", async () => {
    mockPage.findFirst.mockResolvedValue(page);

    const res = await request(app)
      .get("/api/pages/1")
      .set("Authorization", `Bearer ${authToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(page);
  });

  it("responds with 200 and null when page not found", async () => {
    mockPage.findFirst.mockResolvedValue(null);

    const res = await request(app)
      .get("/api/pages/1")
      .set("Authorization", `Bearer ${authToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeNull();
  });
});
