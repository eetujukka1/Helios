import { describe, it, expect, beforeEach } from "@jest/globals";

import { mockProxy, resetMockClient, setupPrismaMockClient } from "./helpers.js";

setupPrismaMockClient();

const { default: app } = await import("../app.js");
const { authToken, setupEnv } = await import("./helpers.js");
const { default: request } = await import("supertest");


beforeEach(() => {
  setupEnv();
  resetMockClient();
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

describe("POST /api/proxies", () => {
  it("responds with 401 when no token provided", async () => {
    const res = await request(app).post("/api/proxies");
    expect(res.status).toBe(401);
  });

  it("responds with 403 on invalid token", async () => {
    const res = await request(app)
      .post("/api/proxies")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.status).toBe(403);
  });

  it("responds with 400 on invalid body", async () => {
    const res = await request(app)
      .post("/api/proxies")
      .set("Authorization", `Bearer ${authToken()}`)
      .send({ proxies: [{ invalid: "data" }] });
    expect(res.status).toBe(400);
  });

  it("responds with 400 when host is empty string", async () => {
    const res = await request(app)
      .post("/api/proxies")
      .set("Authorization", `Bearer ${authToken()}`)
      .send({ proxies: [{ host: "", port: 8080, username: "user" }] });
    expect(res.status).toBe(400);
  });

  it("responds with 201 when username is empty string", async () => {
    mockProxy.createManyAndReturn.mockResolvedValue([
      { ...proxy, username: null },
    ]);

    const res = await request(app)
      .post("/api/proxies")
      .set("Authorization", `Bearer ${authToken()}`)
      .send({
        proxies: [{ host: "proxy.example.com", port: 8080, username: "" }],
      });
    expect(res.status).toBe(201);
  });

  it("responds with 201 when username is omitted", async () => {
    mockProxy.createManyAndReturn.mockResolvedValue([
      { ...proxy, username: null },
    ]);

    const res = await request(app)
      .post("/api/proxies")
      .set("Authorization", `Bearer ${authToken()}`)
      .send({ proxies: [{ host: "proxy.example.com", port: 8080 }] });

    expect(res.status).toBe(201);
  });

  it("responds with 201 and the created proxies", async () => {
    mockProxy.createManyAndReturn.mockResolvedValue([proxy]);

    const res = await request(app)
      .post("/api/proxies")
      .set("Authorization", `Bearer ${authToken()}`)
      .send({
        proxies: [
          {
            host: "proxy.example.com",
            port: 8080,
            username: "user",
            password: "pass",
          },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body).toEqual([proxy]);
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

describe("PATCH /api/proxies/:id", () => {
  it("responds with 401 when no token provided", async () => {
    const res = await request(app).patch("/api/proxies/1");
    expect(res.status).toBe(401);
  });

  it("responds with 403 on invalid token", async () => {
    const res = await request(app)
      .patch("/api/proxies/1")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.status).toBe(403);
  });

  it("responds with 400 on non-numeric id", async () => {
    const res = await request(app)
      .patch("/api/proxies/abc")
      .set("Authorization", `Bearer ${authToken()}`)
      .send({ host: "proxy.example.com" });
    expect(res.status).toBe(400);
  });

  it("responds with 400 on invalid body", async () => {
    const res = await request(app)
      .patch("/api/proxies/1")
      .set("Authorization", `Bearer ${authToken()}`)
      .send({ host: "" });
    expect(res.status).toBe(400);
  });

  it("responds with 400 when body is empty", async () => {
    const res = await request(app)
      .patch("/api/proxies/1")
      .set("Authorization", `Bearer ${authToken()}`)
      .send({});
    expect(res.status).toBe(400);
  });

  it("responds with 200 and the updated proxy", async () => {
    mockProxy.update.mockResolvedValue({
      ...proxy,
      host: "updated.example.com",
      disabled: true,
    });

    const res = await request(app)
      .patch("/api/proxies/1")
      .set("Authorization", `Bearer ${authToken()}`)
      .send({ host: "updated.example.com", disabled: true });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      ...proxy,
      host: "updated.example.com",
      disabled: true,
    });
    expect(mockProxy.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { host: "updated.example.com", disabled: true },
    });
  });
});
