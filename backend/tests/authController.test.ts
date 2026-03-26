import { describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app.js";
import { SECRET, setupEnv } from "./helpers.js";

beforeEach(setupEnv);

describe("POST /api/auth/login", () => {
  it("responds with 200 and a signed token on valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "admin", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    const decoded = jwt.verify(res.body.token, SECRET) as { username: string };
    expect(decoded.username).toBe("admin");
  });

  it("responds with 401 on wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "admin", password: "wrong" });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Invalid credentials" });
  });

  it("responds with 401 on wrong username", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "unknown", password: "password123" });

    expect(res.status).toBe(401);
  });

  it("responds with 401 when body is empty", async () => {
    const res = await request(app).post("/api/auth/login").send({});

    expect(res.status).toBe(401);
  });
});
