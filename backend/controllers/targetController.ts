import * as z from "zod";
import { PrismaClient } from "../generated/prisma/client.js";
import { Request, Response } from "express";
import { TargetCreateSchema, PageCreateSchema } from "@helios/shared";
import { createRedisConnection, createPageLoadQueue } from "@helios/queue";

const prisma = new PrismaClient();

const redisConnection = createRedisConnection();
const pageLoadQueue = createPageLoadQueue(redisConnection);

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
  const targets = z
    .array(TargetCreateSchema)
    .parse(req.body.targets)
    .map((target) => ({
      ...target,
      domain: new URL(target.domain).origin,
    }));
  const addedTargets = await prisma.target.createManyAndReturn({ data: targets });

  const addedPages = await prisma.page.createManyAndReturn({data: addedTargets.map(target => ({url: target.domain, targetId: target.id}))});

  await pageLoadQueue.addBulk(addedPages.map(page => ({ name: "load", data: { id: page.id, url: page.url } })));

  res.status(201).json(addedTargets);
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const deleted = await prisma.target.delete({ where: { id: res.locals.id } });
  res.json(deleted);
};

export const addPages = async (req: Request, res: Response): Promise<void> => {
  const target = await prisma.target.findUniqueOrThrow({
    where: { id: res.locals.id },
  });
  const pages = z
    .array(PageCreateSchema)
    .parse(req.body.pages)
    .map((page) => ({
      ...page,
      targetId: target.id,
    }));

  const addedPages = await prisma.page.createManyAndReturn({
    data: pages,
  });

  res.status(201).json(addedPages);
};

export const getPages = async (req: Request, res: Response): Promise<void> => {
  const pages = await prisma.page.findMany({
    where: {
      targetId: res.locals.id,
    },
  });
  res.json(pages);
};
