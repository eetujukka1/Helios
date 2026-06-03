import { Response, NextFunction } from "express";
import { ActorTypeEnum } from "../schemas/auth.js";
import type { AuthenticatedRequest } from "../schemas/auth.js";
import { LogComponent, LogEvent, LogResult } from "../config/logAttributes.js";
import { logger } from "../services/logger.js";

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
      logger.warn("Request actor does not have required role", {
        component: LogComponent.Auth,
        event: LogEvent.RequestForbidden,
        result: LogResult.Failure,
        method: req.method,
        path: req.path,
        status_code: 403,
        actor_type: actorType,
        allowed_roles: allowedRoles,
      });
      res.sendStatus(403);
      return;
    }

    next();
  };

  return requireRole;
};
