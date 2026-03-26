import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void => {
  if (err instanceof ZodError) {
    res.status(400).json({ error: err.issues });
    return;
  }
  res.status(500).json({ error: "Internal server error" });
};
