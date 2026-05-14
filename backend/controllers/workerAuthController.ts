import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import type { AuthClaims } from "../schemas/auth.js";
import { ActorTypeEnum } from "../schemas/auth.js";
import { envService } from "../services/envService.js";

export const authenticateWorker = (req: Request, res: Response): void => {
  const { workerId, secret } = req.body;
  if (
    workerId === envService.get("DEMO_WORKER_ID") &&
    secret === envService.get("DEMO_WORKER_SECRET")
  ) {
    const claims: AuthClaims = {
      actorType: ActorTypeEnum.Worker,
      workerId,
    };

    const token = jwt.sign(claims, envService.getRequired("JWT_SECRET"));
    res.json({ token });
    return;
  }
  res.status(401).json({ message: "Invalid credentials" });
};
