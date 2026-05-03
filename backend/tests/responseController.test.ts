import { describe, it, expect, beforeEach, jest } from "@jest/globals";

import { mockResponse, setupPrismaMockClient } from "./helpers.js";

setupPrismaMockClient();

const { default: app } = await import("../app.js");
const { authToken, setupEnv } = await import("./helpers.js");
const { default: request } = await import("supertest");

beforeEach(() => {
  setupEnv();
  mockResponse.findMany.mockReset();
  mockResponse.findFirst.mockReset();
  mockResponse.createManyAndReturn.mockReset();
});

const response = {
  id: 1,
  pageId: 1,
  fileId: 1,
  proxyId: 1,
  statusCode: 200,
  date: Date.now(),
};

describe("GET /api/responses", () => {
  it("responds with 401 when no token provided", async () => {
    const res = await request(app).get("/api/responses");
    expect(res.status).toBe(401);
  });

  it("responds with 403 on invalid token", async () => {
    const res = await request(app)
      .get("/api/responses")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.status).toBe(403);
  });

  it("responds with 200 and an array of responses", async () => {
    mockResponse.findMany.mockResolvedValue([response]);

    const res = await request(app)
      .get("/api/responses")
      .set("Authorization", `Bearer ${authToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([response]);
  });

  it("responds with 200 and empty array when no responses exist", async () => {
    mockResponse.findMany.mockResolvedValue([]);

    const res = await request(app)
      .get("/api/responses")
      .set("Authorization", `Bearer ${authToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe("GET /api/responses/:id", () => {
  it("responds with 401 when no token provided", async () => {
    const res = await request(app).get("/api/responses/1");
    expect(res.status).toBe(401);
  });

  it("responds with 403 on invalid token", async () => {
    const res = await request(app)
      .get("/api/responses/1")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.status).toBe(403);
  });

  it("responds with 400 on non-numeric id", async () => {
    const res = await request(app)
      .get("/api/responses/abc")
      .set("Authorization", `Bearer ${authToken()}`);
    expect(res.status).toBe(400);
  });

  it("responds with 200 and the response", async () => {
    mockResponse.findFirst.mockResolvedValue(response);

    const res = await request(app)
      .get("/api/responses/1")
      .set("Authorization", `Bearer ${authToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(response);
  });

  it("responds with 200 and null when response not found", async () => {
    mockResponse.findFirst.mockResolvedValue(null);

    const res = await request(app)
      .get("/api/responses/1")
      .set("Authorization", `Bearer ${authToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeNull();
  });
});
