import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import type { AuthClaims } from "../schemas/auth.js";
import { ActorTypeEnum } from "../schemas/auth.js";
import { envService } from "../services/envService.js";
import { LogComponent, LogEvent, LogResult } from "../config/logAttributes.js";
import { logger } from "../services/logger.js";

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
    logger.info("Worker authentication succeeded", {
      component: LogComponent.Auth,
      event: LogEvent.WorkerAuthSucceeded,
      result: LogResult.Success,
      actor_type: ActorTypeEnum.Worker,
      worker_id: workerId,
    });
    res.json({ token });
    return;
  }
  logger.warn("Worker authentication failed", {
    component: LogComponent.Auth,
    event: LogEvent.WorkerAuthFailed,
    result: LogResult.Failure,
    actor_type: ActorTypeEnum.Worker,
    worker_id: workerId,
  });
  res.status(401).json({ message: "Invalid credentials" });
};
