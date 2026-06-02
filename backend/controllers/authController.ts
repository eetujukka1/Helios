import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { AuthClaims, ActorTypeEnum } from "../schemas/auth.js";
import { envService } from "../services/envService.js";
import { LogComponent, LogEvent, LogResult } from "../config/logAttributes.js";
import { logger } from "../services/logger.js";

export const login = (req: Request, res: Response): void => {
  const { username, password } = req.body;
  if (
    username === envService.get("DEMO_USER_USERNAME") &&
    password === envService.get("DEMO_USER_PASSWORD")
  ) {
    const claims: AuthClaims = {
      actorType: ActorTypeEnum.User,
      username,
    };
    const token = jwt.sign(claims, envService.getRequired("JWT_SECRET"));
    logger.info("User login succeeded", {
      component: LogComponent.Auth,
      event: LogEvent.AuthLoginSucceeded,
      result: LogResult.Success,
      actor_type: ActorTypeEnum.User,
      username,
    });
    res.json({ token });
    return;
  }
  logger.warn("User login failed", {
    component: LogComponent.Auth,
    event: LogEvent.AuthLoginFailed,
    result: LogResult.Failure,
    actor_type: ActorTypeEnum.User,
    username,
  });
  res.status(401).json({ message: "Invalid credentials" });
};
