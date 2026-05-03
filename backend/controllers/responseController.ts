import { PrismaClient } from "../generated/prisma/client.js";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getAll = async (req: Request, res: Response): Promise<void> => {
  const responses = await prisma.response.findMany();
  res.json(responses);
};

export const getOne = async (req: Request, res: Response): Promise<void> => {
  const response = await prisma.response.findFirst({
    where: { id: res.locals.id },
  });
  res.json(response);
};
