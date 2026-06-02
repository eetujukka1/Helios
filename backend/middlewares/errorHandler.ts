import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { LogComponent, LogEvent, LogResult } from "../config/logAttributes.js";
import { logger } from "../services/logger.js";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void => {
  if (err instanceof ZodError) {
    logger.warn("Request validation failed", {
      component: LogComponent.Backend,
      event: LogEvent.ValidationFailed,
      result: LogResult.Failure,
      method: req.method,
      path: req.path,
      status_code: 400,
      count: err.issues.length,
    });
    res.status(400).json({ error: err.issues });
    return;
  }
  logger.error("Unhandled request error", err, {
    component: LogComponent.Backend,
    event: LogEvent.RequestFailed,
    result: LogResult.Failure,
    method: req.method,
    path: req.path,
    status_code: 500,
  });
  res.status(500).json({ error: "Internal server error" });
};
