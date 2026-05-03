import { describe, it, expect, beforeEach, jest } from "@jest/globals";

import { mockFile } from "./helpers.js";

jest.unstable_mockModule("../generated/prisma/client.js", () => ({
  PrismaClient: jest.fn(() => ({ file: mockFile })),
}));

const { default: app } = await import("../app.js");
const { workerAuthToken, setupEnv } = await import("./helpers.js");
const { default: request } = await import("supertest");


beforeEach(() => {
  setupEnv();
  mockFile.findMany.mockReset();
  mockFile.findFirst.mockReset();
  mockFile.createManyAndReturn.mockReset();
  mockFile.delete.mockReset();
});

const file = {
  name: "index.html",
};

describe("GET /api/files", () => {
  it("responds with 401 when no token provided", async () => {
    const res = await request(app).get("/api/files");
    expect(res.status).toBe(401);
  });

  it("responds with 403 on invalid token", async () => {
    const res = await request(app)
      .get("/api/files")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.status).toBe(403);
  });

  it("responds with 200 and an array of files", async () => {
    mockFile.findMany.mockResolvedValue([file]);

    const res = await request(app)
      .get("/api/files")
      .set("Authorization", `Bearer ${workerAuthToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([file]);
  });

  it("responds with 200 and empty array when no files exist", async () => {
    mockFile.findMany.mockResolvedValue([]);

    const res = await request(app)
      .get("/api/files")
      .set("Authorization", `Bearer ${workerAuthToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe("GET /api/files/:id", () => {
  it("responds with 401 when no token provided", async () => {
    const res = await request(app).get("/api/files/1");
    expect(res.status).toBe(401);
  });

  it("responds with 403 on invalid token", async () => {
    const res = await request(app)
      .get("/api/files/1")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.status).toBe(403);
  });

  it("responds with 400 on non-numeric id", async () => {
    const res = await request(app)
      .get("/api/files/abc")
      .set("Authorization", `Bearer ${workerAuthToken()}`);
    expect(res.status).toBe(400);
  });

  it("responds with 200 and the file", async () => {
    mockFile.findFirst.mockResolvedValue(file);

    const res = await request(app)
      .get("/api/files/1")
      .set("Authorization", `Bearer ${workerAuthToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(file);
  });

  it("responds with 200 and null when file not found", async () => {
    mockFile.findFirst.mockResolvedValue(null);

    const res = await request(app)
      .get("/api/files/1")
      .set("Authorization", `Bearer ${workerAuthToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeNull();
  });
});

describe("POST /api/files", () => {
  it("responds with 401 when no token provided", async () => {
    const res = await request(app).post("/api/files");
    expect(res.status).toBe(401);
  });

  it("responds with 403 on invalid token", async () => {
    const res = await request(app)
      .post("/api/files")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.status).toBe(403);
  });

  it("responds with 400 on invalid body", async () => {
    const res = await request(app)
      .post("/api/files")
      .set("Authorization", `Bearer ${workerAuthToken()}`)
      .send({ files: [{ invalid: "data" }] });
    expect(res.status).toBe(400);
  });

  it("responds with 400 when host is empty string", async () => {
    const res = await request(app)
      .post("/api/files")
      .set("Authorization", `Bearer ${workerAuthToken()}`)
      .send({ files: [{ name: "" }] });
    expect(res.status).toBe(400);
  });

  it("responds with 201 and the created files", async () => {
    mockFile.createManyAndReturn.mockResolvedValue([file]);

    const res = await request(app)
      .post("/api/files")
      .set("Authorization", `Bearer ${workerAuthToken()}`)
      .send({
        files: [
          {
            name: "index.html",
          },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body).toEqual([file]);
  });
});

describe("DELETE /api/files/:id", () => {
  it("responds with 401 when no token provided", async () => {
    const res = await request(app).delete("/api/files/1");
    expect(res.status).toBe(401);
  });

  it("responds with 403 on invalid token", async () => {
    const res = await request(app)
      .delete("/api/files/1")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.status).toBe(403);
  });

  it("responds with 400 on non-numeric id", async () => {
    const res = await request(app)
      .delete("/api/files/abc")
      .set("Authorization", `Bearer ${workerAuthToken()}`);
    expect(res.status).toBe(400);
  });

  it("responds with 200 and the deleted file", async () => {
    mockFile.delete.mockResolvedValue(file);

    const res = await request(app)
      .delete("/api/files/1")
      .set("Authorization", `Bearer ${workerAuthToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(file);
  });
});
