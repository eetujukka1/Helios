import { describe, it, expect, beforeEach } from "@jest/globals";

import {
  mockPage,
  mockResponse,
  mockUploadObject,
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

describe("POST /api/pages/:id/responses", () => {
  const createdResponse = {
    id: 1,
    pageId: 1,
    fileId: null,
    proxyId: 2,
    statusCode: 201,
    date: new Date("2026-05-14T12:00:00.000Z").toISOString(),
    file: null,
    proxy: { id: 2 },
  };

  it("responds with 401 when no token provided", async () => {
    const res = await request(app)
      .post("/api/pages/1/responses")
      .send({ statusCode: 200 });

    expect(res.status).toBe(401);
  });

  it("responds with 403 on invalid token", async () => {
    const res = await request(app)
      .post("/api/pages/1/responses")
      .set("Authorization", "Bearer invalidtoken")
      .send({ statusCode: 200 });

    expect(res.status).toBe(403);
  });

  it("responds with 400 on non-numeric id", async () => {
    const res = await request(app)
      .post("/api/pages/abc/responses")
      .set("Authorization", `Bearer ${workerAuthToken()}`)
      .send({ statusCode: 200 });

    expect(res.status).toBe(400);
  });

  it("creates a response without a file", async () => {
    mockResponse.create.mockResolvedValue(createdResponse);

    const res = await request(app)
      .post("/api/pages/1/responses")
      .set("Authorization", `Bearer ${workerAuthToken()}`)
      .send({ proxyId: 2, statusCode: 201 });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(createdResponse);
    expect(mockUploadObject).not.toHaveBeenCalled();
    expect(mockResponse.create).toHaveBeenCalledWith({
      data: {
        page: { connect: { id: 1 } },
        statusCode: 201,
        proxy: { connect: { id: 2 } },
        file: undefined,
      },
    });
  });

  it("uploads contents.html before creating nested file and response records", async () => {
    const createdResponseWithFile = {
      ...createdResponse,
      fileId: 3,
      file: { id: 3, name: "uploaded-key" },
    };
    mockResponse.create.mockResolvedValue(createdResponseWithFile);

    const res = await request(app)
      .post("/api/pages/1/responses")
      .set("Authorization", `Bearer ${workerAuthToken()}`)
      .field("statusCode", "200")
      .attach("contents.html", Buffer.from("<html></html>"), {
        filename: "contents.html",
        contentType: "text/html",
      });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(createdResponseWithFile);
    expect(mockUploadObject).toHaveBeenCalledWith({
      key: expect.any(String),
      body: Buffer.from("<html></html>"),
      contentType: "text/html",
      metadata: {
        originalName: "contents.html",
      },
    });
    const uploadedKey = mockUploadObject.mock.calls[0]?.[0].key;
    expect(mockResponse.create).toHaveBeenCalledWith({
      data: {
        page: { connect: { id: 1 } },
        statusCode: 200,
        proxy: undefined,
        file: {
          create: { name: uploadedKey },
        },
      },
    });
    expect(mockUploadObject.mock.invocationCallOrder[0]).toBeLessThan(
      mockResponse.create.mock.invocationCallOrder[0],
    );
  });
});
