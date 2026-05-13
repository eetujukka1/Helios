import { describe, it, expect, beforeEach } from "@jest/globals";

import {
  mockPage,
  mockResponse,
  resetMockClient,
  setupPrismaMockClient,
} from "./helpers.js";

setupPrismaMockClient();

const { default: app } = await import("../app.js");
const { authToken, workerAuthToken, setupEnv } = await import("./helpers.js");
const { default: request } = await import("supertest");

beforeEach(() => {
  setupEnv();
  resetMockClient();
});

const page = {
  id: 1,
  url: "example.com/blog/1",
  targetId: 1,
};

const responses = [
  {
    pageId: 1,
    fileId: 1,
    proxyId: 1,
    statusCode: 200,
    date: Date.now(),
  },
  {
    pageId: 1,
    fileId: 1,
    proxyId: 1,
    statusCode: 200,
    date: Date.now(),
  },
  {
    pageId: 1,
    fileId: 1,
    proxyId: 1,
    statusCode: 200,
    date: Date.now(),
  },
];

const returnedResponses = responses.map((p, i) => ({
  ...p,
  id: i,
  targetId: 1,
}));

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

describe("GET /api/pages/:id/responses", () => {
  it("responds with 401 when no token provided", async () => {
    const res = await request(app).get("/api/pages/1/responses");
    expect(res.status).toBe(401);
  });

  it("responds with 403 on invalid token", async () => {
    const res = await request(app)
      .get("/api/pages/1/responses")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.status).toBe(403);
  });

  it("responds with 200 and an array of pages", async () => {
    mockResponse.findMany.mockResolvedValue(returnedResponses);

    const res = await request(app)
      .get("/api/pages/1/responses")
      .set("Authorization", `Bearer ${workerAuthToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(returnedResponses);
  });

  it("responds with 200 and empty array when no pages exist", async () => {
    mockResponse.findMany.mockResolvedValue([]);

    const res = await request(app)
      .get("/api/pages/1/responses")
      .set("Authorization", `Bearer ${workerAuthToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
