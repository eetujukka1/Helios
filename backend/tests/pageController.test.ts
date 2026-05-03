import { describe, it, expect, beforeEach, jest } from "@jest/globals";

import { mockPage, mockResponse } from "./helpers.js";

jest.unstable_mockModule("../generated/prisma/client.js", () => ({
  PrismaClient: jest.fn(() => ({ page: mockPage, response: mockResponse })),
}));

const { default: app } = await import("../app.js");
const { authToken, workerAuthToken, setupEnv } = await import("./helpers.js");
const { default: request } = await import("supertest");

beforeEach(() => {
  setupEnv();
  mockPage.findMany.mockReset();
  mockPage.findFirst.mockReset();
  mockPage.createManyAndReturn.mockReset();
  mockPage.findUniqueOrThrow.mockReset();
  mockResponse.createManyAndReturn.mockReset();
  mockResponse.findFirst.mockReset();
  mockResponse.findMany.mockReset();
  mockResponse.findUniqueOrThrow.mockReset();
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

describe("POST /api/pages/:id/responses", () => {
  it("responds with 201 and the created pages", async () => {
    mockPage.findUniqueOrThrow.mockResolvedValue(page);
    mockResponse.createManyAndReturn.mockResolvedValue(returnedResponses);

    const res = await request(app)
      .post("/api/pages/1/responses")
      .set("Authorization", `Bearer ${workerAuthToken()}`)
      .send({ responses });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(returnedResponses);
  });

  it("responds with 403 when using invalid token", async () => {
    const res = await request(app)
      .post("/api/pages/1/responses")
      .set("Authorization", `Bearer ${authToken()}`)
      .send({ responses });

    expect(res.status).toBe(403);
  });

  it("responds with 401 when no token provided", async () => {
    const res = await request(app)
      .post("/api/targets/1/pages")
      .send({ request });

    expect(res.status).toBe(401);
  });

  it("responds with 400 on invalid body", async () => {
    const res = await request(app)
      .post("/api/pages/1/responses")
      .set("Authorization", `Bearer ${workerAuthToken()}`)
      .send({ data: "" });

    expect(res.status).toBe(400);
  });
});
