import { Response, NextFunction } from "express";
import { ActorTypeEnum } from "../schemas/auth.js";
import type { AuthenticatedRequest } from "../schemas/auth.js";

export const createRequireRole = (
  roleOrRoles: ActorTypeEnum | readonly ActorTypeEnum[],
) => {
  const allowedRoles = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];

  const requireRole = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    const actorType = req.auth?.actorType;
    const hasRequiredRole =
      actorType !== undefined &&
      allowedRoles.some((role) => role === actorType);

    if (!hasRequiredRole) {
      res.sendStatus(403);
      return;
    }

    next();
  };

  return requireRole;
};
