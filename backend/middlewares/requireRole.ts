import { Response, NextFunction } from "express";
import { ActorTypeEnum } from "../schemas/auth.js";
import type { AuthenticatedRequest } from "../schemas/auth.js";

export const createRequireRole = (roleOrRoles: ActorTypeEnum | ActorTypeEnum[]) => {
  const roles = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];
  const requireRole = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!roles.includes(req.auth?.actorType as ActorTypeEnum)) {
      res.sendStatus(403);
      return;
    }
    next();
  };
  return requireRole;
};
