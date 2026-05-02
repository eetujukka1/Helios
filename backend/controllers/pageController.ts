import * as z from "zod";
import { PrismaClient } from "../generated/prisma/client.js";
import { Request, Response } from "express";
import { ResponseCreateSchema } from "@helios/shared";

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
  res.status(200).json(responses);
};

export const addResponses = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const page = await prisma.page.findUniqueOrThrow({
    where: { id: res.locals.id },
  });
  const responses = z
    .array(ResponseCreateSchema)
    .parse(req.body.responses)
    .map((response) => ({
      ...response,
      pageId: page.id,
    }));

  const addedResponses = await prisma.response.createManyAndReturn({
    data: responses,
  });

  res.status(201).json(addedResponses);
};
