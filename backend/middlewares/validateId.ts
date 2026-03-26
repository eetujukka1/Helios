import { Request, Response, NextFunction } from "express";
import * as z from "zod";

const IdSchema = z.coerce.number().int().positive();

export const validateId = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const id = IdSchema.parse(req.params.id);
  res.locals.id = id;
  next();
};
