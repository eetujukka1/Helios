import { describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import express, { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { authenticateToken } from "../middlewares/auth.js";
import { SECRET, setupEnv } from "./helpers.js";

beforeEach(setupEnv);

const app = express();
app.get(
  "/protected",
  authenticateToken,
  (req: Request & { user?: JwtPayload | string }, res) =>
    res.json({ user: req.user }),
);

describe("GET /protected", () => {
  it("responds with 200 and attaches user on a valid token", async () => {
    const token = jwt.sign({ username: "admin" }, SECRET);
    const res = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({ username: "admin" });
  });

  it("responds with 401 when no Authorization header is present", async () => {
    const res = await request(app).get("/protected");
    expect(res.status).toBe(401);
  });

  it("responds with 403 for a token signed with the wrong secret", async () => {
    const token = jwt.sign({ username: "admin" }, "wrongsecret");
    const res = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it("responds with 403 for a malformed token", async () => {
    const res = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer notavalidtoken");

    expect(res.status).toBe(403);
  });
});
