import * as z from "zod";
import { PrismaClient } from "../generated/prisma/client.js"
import { Request, Response } from "express";
import { FileCreateSchema } from "@helios/shared"

const prisma = new PrismaClient();

export const getAll = async (req: Request, res: Response): Promise<void> => {
  const files = await prisma.file.findMany();
  res.json(files);
};

export const getOne = async (req: Request, res: Response): Promise<void> => {
  const file = await prisma.file.findFirst({ where: { id: res.locals.id } });
  res.json(file);
};

export const add = async (req: Request, res: Response): Promise<void> => {
  const files = z.array(FileCreateSchema).parse(req.body.files);
  const addedFiles = await prisma.file.createManyAndReturn({
    data: files,
  });
  res.status(201).json(addedFiles);
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const deleted = await prisma.file.delete({ where: { id: res.locals.id } });
  res.json(deleted);
};