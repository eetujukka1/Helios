import * as z from "zod";
import { PrismaClient } from "../generated/prisma/client.js";
import { Request, Response } from "express";
import { ProxyCreateSchema } from "@helios/shared";

const prisma = new PrismaClient();

export const getAll = async (req: Request, res: Response): Promise<void> => {
  const proxies = await prisma.proxy.findMany();
  res.json(proxies);
};

export const getOne = async (req: Request, res: Response): Promise<void> => {
  const proxy = await prisma.proxy.findFirst({ where: { id: res.locals.id } });
  res.json(proxy);
};

export const add = async (req: Request, res: Response): Promise<void> => {
  const proxies = z.array(ProxyCreateSchema).parse(req.body.proxies);
  const addedProxies = await prisma.proxy.createManyAndReturn({
    data: proxies,
  });
  res.status(201).json(addedProxies);
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const deleted = await prisma.proxy.delete({ where: { id: res.locals.id } });
  res.json(deleted);
};
