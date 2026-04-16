import { describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import {
  authenticateToken,
  type AuthenticatedRequest,
} from "../middlewares/auth.js";
import { SECRET, setupEnv } from "./helpers.js";
import type { AuthClaims } from "../schemas/auth.js";
import { ActorTypeEnum } from "../schemas/auth.js";

beforeEach(setupEnv);

const app = express();
app.get("/protected", authenticateToken, (req: AuthenticatedRequest, res) =>
  res.json({ auth: req.auth }),
);

describe("GET /protected", () => {
  it("responds with 200 and attaches auth claims on a valid token", async () => {
    const claims: AuthClaims = {
      actorType: ActorTypeEnum.User,
      username: "admin",
    };
    const token = jwt.sign(claims, SECRET);
    const res = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.auth).toEqual(claims);
  });

  it("responds with 401 when no Authorization header is present", async () => {
    const res = await request(app).get("/protected");
    expect(res.status).toBe(401);
  });

  it("responds with 403 for a token signed with the wrong secret", async () => {
    const token = jwt.sign(
      { actorType: ActorTypeEnum.User, username: "admin" } satisfies AuthClaims,
      "wrongsecret",
    );
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

  it("responds with 403 for a token with an invalid claim shape", async () => {
    const token = jwt.sign({ username: "admin" }, SECRET);
    const res = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });
});
