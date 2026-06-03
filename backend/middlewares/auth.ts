import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AuthClaimsSchema } from "../schemas/auth.js";
import type { AuthenticatedRequest } from "../schemas/auth.js";
import { envService } from "../services/envService.js";
import { LogComponent, LogEvent, LogResult } from "../config/logAttributes.js";
import { logger } from "../services/logger.js";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    logger.warn("Request missing bearer token", {
      component: LogComponent.Auth,
      event: LogEvent.RequestUnauthorized,
      result: LogResult.Failure,
      method: req.method,
      path: req.path,
      status_code: 401,
      reason: "missing_token",
    });
    res.sendStatus(401);
    return;
  }

  try {
    const decoded = jwt.verify(token, envService.getRequired("JWT_SECRET"));
    const claims = AuthClaimsSchema.safeParse(decoded);

    if (!claims.success) {
      logger.warn("Request token claims failed validation", {
        component: LogComponent.Auth,
        event: LogEvent.RequestForbidden,
        result: LogResult.Failure,
        method: req.method,
        path: req.path,
        status_code: 403,
        reason: "invalid_claims",
      });
      res.sendStatus(403);
      return;
    }

    (req as AuthenticatedRequest).auth = claims.data;
    next();
  } catch (error) {
    logger.warn("Request token verification failed", {
      component: LogComponent.Auth,
      event: LogEvent.RequestForbidden,
      result: LogResult.Failure,
      method: req.method,
      path: req.path,
      status_code: 403,
      reason: error instanceof Error ? error.name : "token_verification_failed",
    });
    res.sendStatus(403);
  }
};
