import { PrismaClient } from "../generated/prisma/client.js";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getAll = async (req: Request, res: Response): Promise<void> => {
  const pages = await prisma.page.findMany();
  res.json(pages);
};

export const getOne = async (req: Request, res: Response): Promise<void> => {
  const page = await prisma.page.findFirst({ where: { id: res.locals.id } });
  res.json(page);
};

export const getResponses = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const responses = await prisma.response.findMany({
    where: {
      pageId: res.locals.id,
    },
  });
  res.json(responses);
};
