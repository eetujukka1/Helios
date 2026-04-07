import * as z from "zod";
import { PrismaClient } from "../generated/prisma/client.js";
import { Request, Response } from "express";
import { TargetCreateSchema } from "@helios/shared";

const prisma = new PrismaClient();

export const getAll = async (req: Request, res: Response): Promise<void> => {
  const targets = await prisma.target.findMany();
  res.json(targets);
};

export const getOne = async (req: Request, res: Response): Promise<void> => {
  const target = await prisma.target.findFirst({
    where: { id: res.locals.id },
  });
  res.json(target);
};

export const add = async (req: Request, res: Response): Promise<void> => {
  const targets = z.array(TargetCreateSchema).parse(req.body.targets);
  const addedSites = await prisma.target.createManyAndReturn({ data: targets });
  res.status(201).json(addedSites);
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const deleted = await prisma.target.delete({ where: { id: res.locals.id } });
  res.json(deleted);
};
