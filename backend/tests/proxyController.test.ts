import { describe, it, expect, beforeEach, jest } from "@jest/globals";

const mockProxy = {
  findMany: jest.fn<() => Promise<object[]>>(),
  findFirst: jest.fn<() => Promise<object | null>>(),
  delete: jest.fn<() => Promise<object | null>>(),
};

jest.unstable_mockModule("../generated/prisma/client.js", () => ({
  PrismaClient: jest.fn(() => ({ proxy: mockProxy })),
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
  mockProxy.findMany.mockReset();
  mockProxy.findFirst.mockReset();
  mockProxy.delete.mockReset();
});

const proxy = {
  id: 1,
  host: "proxy.example.com",
  port: 8080,
  username: "user",
  password: "pass",
  enabled: true,
};

describe("GET /api/proxies", () => {
  it("responds with 401 when no token provided", async () => {
    const res = await request(app).get("/api/proxies");
    expect(res.status).toBe(401);
  });

  it("responds with 403 on invalid token", async () => {
    const res = await request(app)
      .get("/api/proxies")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.status).toBe(403);
  });

  it("responds with 200 and an array of proxies", async () => {
    mockProxy.findMany.mockResolvedValue([proxy]);

    const res = await request(app)
      .get("/api/proxies")
      .set("Authorization", `Bearer ${authToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([proxy]);
  });

  it("responds with 200 and empty array when no proxies exist", async () => {
    mockProxy.findMany.mockResolvedValue([]);

    const res = await request(app)
      .get("/api/proxies")
      .set("Authorization", `Bearer ${authToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe("GET /api/proxies/:id", () => {
  it("responds with 401 when no token provided", async () => {
    const res = await request(app).get("/api/proxies/1");
    expect(res.status).toBe(401);
  });

  it("responds with 403 on invalid token", async () => {
    const res = await request(app)
      .get("/api/proxies/1")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.status).toBe(403);
  });

  it("responds with 400 on non-numeric id", async () => {
    const res = await request(app)
      .get("/api/proxies/abc")
      .set("Authorization", `Bearer ${authToken()}`);
    expect(res.status).toBe(400);
  });

  it("responds with 200 and the proxy", async () => {
    mockProxy.findFirst.mockResolvedValue(proxy);

    const res = await request(app)
      .get("/api/proxies/1")
      .set("Authorization", `Bearer ${authToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(proxy);
  });

  it("responds with 200 and null when proxy not found", async () => {
    mockProxy.findFirst.mockResolvedValue(null);

    const res = await request(app)
      .get("/api/proxies/1")
      .set("Authorization", `Bearer ${authToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeNull();
  });
});

describe("DELETE /api/proxies/:id", () => {
  it("responds with 401 when no token provided", async () => {
    const res = await request(app).delete("/api/proxies/1");
    expect(res.status).toBe(401);
  });

  it("responds with 403 on invalid token", async () => {
    const res = await request(app)
      .delete("/api/proxies/1")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.status).toBe(403);
  });

  it("responds with 400 on non-numeric id", async () => {
    const res = await request(app)
      .delete("/api/proxies/abc")
      .set("Authorization", `Bearer ${authToken()}`);
    expect(res.status).toBe(400);
  });

  it("responds with 200 and the deleted proxy", async () => {
    mockProxy.delete.mockResolvedValue(proxy);

    const res = await request(app)
      .delete("/api/proxies/1")
      .set("Authorization", `Bearer ${authToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(proxy);
  });
});
