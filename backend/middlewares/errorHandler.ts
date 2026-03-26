import { Request, Response } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
): void => {
  if (err instanceof ZodError) {
    res.status(400).json({ error: err.issues });
    return;
  }
  res.status(500).json({ error: "Internal server error" });
};
