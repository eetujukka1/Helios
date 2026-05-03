import { describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app.js";
import { SECRET, setupEnv } from "./helpers.js";
import { AuthClaimsSchema } from "../schemas/auth.js";

beforeEach(setupEnv);

describe("POST /api/workers/auth/login", () => {
  it("responds with 200 and a signed token on valid credentials", async () => {
    const res = await request(app)
      .post("/api/workers/auth/login")
      .send({ workerId: "worker", secret: "secretkey" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    const decoded = AuthClaimsSchema.parse(jwt.verify(res.body.token, SECRET));
    expect(decoded).toEqual({
      actorType: "worker",
      workerId: "worker",
    });
  });

  it("responds with 401 on wrong secret", async () => {
    const res = await request(app)
      .post("/api/workers/auth/login")
      .send({ workerId: "admin", secret: "wrong" });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Invalid credentials" });
  });

  it("responds with 401 on wrong workerId", async () => {
    const res = await request(app)
      .post("/api/workers/auth/login")
      .send({ workerId: "unknown", secret: "password123" });

    expect(res.status).toBe(401);
  });

  it("responds with 401 when body is empty", async () => {
    const res = await request(app).post("/api/workers/auth/login").send({});

    expect(res.status).toBe(401);
  });
});
