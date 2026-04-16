import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AuthClaimsSchema } from "../schemas/auth.js";
import type { AuthClaims } from "../schemas/auth.js";

export type AuthenticatedRequest = Request & {
  auth?: AuthClaims;
};

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.sendStatus(401);
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const claims = AuthClaimsSchema.safeParse(decoded);

    if (!claims.success) {
      res.sendStatus(403);
      return;
    }

    (req as AuthenticatedRequest).auth = claims.data;
    next();
  } catch {
    res.sendStatus(403);
  }
};
