import { describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import { authenticateToken } from "../middlewares/auth.js";
import { createRequireRole } from "../middlewares/requireRole.js";
import type { AuthenticatedRequest } from "../schemas/auth.js";
import { SECRET, setupEnv } from "./helpers.js";
import type { AuthClaims } from "../schemas/auth.js";
import { ActorTypeEnum } from "../schemas/auth.js";

beforeEach(setupEnv);

const app = express();
app.get(
  "/protected/user",
  authenticateToken,
  createRequireRole(ActorTypeEnum.User),
  (req: AuthenticatedRequest, res) => res.json({ auth: req.auth }),
);
app.get(
  "/protected/worker",
  authenticateToken,
  createRequireRole(ActorTypeEnum.Worker),
  (req: AuthenticatedRequest, res) => res.json({ auth: req.auth }),
);

app.get(
  "/protected/multi-role",
  authenticateToken,
  createRequireRole([ActorTypeEnum.User, ActorTypeEnum.Worker]),
  (req: AuthenticatedRequest, res) => res.json({ auth: req.auth }),
);

describe("GET /protected/user", () => {
  it("responds with 200 on a valid token and role", async () => {
    const claims: AuthClaims = {
      actorType: ActorTypeEnum.User,
      username: "admin",
    };
    const token = jwt.sign(claims, SECRET);
    const res = await request(app)
      .get("/protected/user")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.auth).toEqual(claims);
  });

  it("responds with 403 on a invalid token and role", async () => {
    const claims: AuthClaims = {
      actorType: ActorTypeEnum.Worker,
      workerId: "worker",
    };
    const token = jwt.sign(claims, SECRET);
    const res = await request(app)
      .get("/protected/user")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });
});

describe("GET /protected/worker", () => {
  it("responds with 200 on a valid token and role", async () => {
    const claims: AuthClaims = {
      actorType: ActorTypeEnum.Worker,
      workerId: "worker",
    };
    const token = jwt.sign(claims, SECRET);
    const res = await request(app)
      .get("/protected/worker")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.auth).toEqual(claims);
  });

  it("responds with 403 on a invalid token and role", async () => {
    const claims: AuthClaims = {
      actorType: ActorTypeEnum.User,
      username: "admin",
    };
    const token = jwt.sign(claims, SECRET);
    const res = await request(app)
      .get("/protected/worker")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });
});

describe("GET /protected/multi-role", () => {
  it("responds with 200 for user role", async () => {
    const claims: AuthClaims = {
      actorType: ActorTypeEnum.User,
      username: "admin",
    };
    const token = jwt.sign(claims, SECRET);
    const res = await request(app)
      .get("/protected/multi-role")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.auth).toEqual(claims);
  });

  it("responds with 200 for worker role", async () => {
    const claims: AuthClaims = {
      actorType: ActorTypeEnum.Worker,
      workerId: "worker",
    };
    const token = jwt.sign(claims, SECRET);
    const res = await request(app)
      .get("/protected/multi-role")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.auth).toEqual(claims);
  });

  it("responds with 403 when role is not in allowed list", async () => {
    const claims = {
      actorType: "Admin",
      username: "admin",
    };
    const token = jwt.sign(claims, SECRET);
    const res = await request(app)
      .get("/protected/multi-role")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });
});
