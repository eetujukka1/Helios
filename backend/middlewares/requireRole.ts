import { Response, NextFunction } from "express";
import { ActorTypeEnum } from "../schemas/auth.js";
import type { AuthenticatedRequest } from "../schemas/auth.js";

export const createRequireRole = (role: ActorTypeEnum) => {
  const requireRole = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    if (req.auth?.actorType != role) {
      res.sendStatus(403);
      return;
    }
    next();
  };
  return requireRole;
};
