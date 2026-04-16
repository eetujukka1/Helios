import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import type { AuthClaims } from "../schemas/auth.js";

export const authenticateWorker = (req: Request, res: Response): void => {
  const { workerId, secret } = req.body;
  if (
    workerId === process.env.DEMO_WORKER_ID &&
    secret === process.env.DEMO_WORKER_SECRET
  ) {
    const claims: AuthClaims = {
      actorType: "worker",
      workerId,
    };

    const token = jwt.sign(claims, process.env.JWT_SECRET as string);
    res.json({ token });
    return;
  }
  res.status(401).json({ message: "Invalid credentials" });
};