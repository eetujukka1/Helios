import * as z from "zod";
import { prisma } from "../services/prisma.js";
import { Request, Response } from "express";
import { TargetCreateSchema, PageCreateSchema } from "@helios/shared";
import { enqueuePageLoads } from "../services/pageLoadQueue.js";
import { addTarget, bulkAddTarget, removeTarget } from "@helios/queue";
import { LogComponent, LogEvent, LogResult } from "../config/logAttributes.js";
import { logger } from "../services/logger.js";

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

export const getAmount = async (req: Request, res: Response): Promise<void> => {
  const amount = await prisma.target.count();
  res.json({ amount });
};

export const add = async (req: Request, res: Response): Promise<void> => {
  const targets = z
    .array(TargetCreateSchema)
    .parse(req.body.targets)
    .map((target) => ({
      ...target,
      domain: new URL(target.domain).origin,
    }));
  const addedTargets = await prisma.target.createManyAndReturn({
    data: targets,
  });

  const addedPages = await prisma.page.createManyAndReturn({
    data: addedTargets.map((target) => ({
      url: target.domain,
      targetId: target.id,
    })),
  });

  await bulkAddTarget(
    addedTargets.map((target) => ({ id: target.id, value: target })),
  );

  await enqueuePageLoads(addedPages);

  logger.info("Targets created", {
    component: LogComponent.Target,
    event: LogEvent.TargetCreated,
    result: LogResult.Success,
    count: addedTargets.length,
  });

  res.status(201).json(addedTargets);
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const deleted = await prisma.target.delete({ where: { id: res.locals.id } });
  await removeTarget(deleted.id);
  logger.info("Target deleted", {
    component: LogComponent.Target,
    event: LogEvent.TargetDeleted,
    result: LogResult.Success,
    target_id: deleted.id,
  });
  res.json(deleted);
};

export const enable = async (req: Request, res: Response): Promise<void> => {
  const enabled = await prisma.target.update({
    where: { id: res.locals.id },
    data: { disabled: false },
  });
  await addTarget(enabled.id, enabled);
  logger.info("Target enabled", {
    component: LogComponent.Target,
    event: LogEvent.TargetEnabled,
    result: LogResult.Success,
    target_id: enabled.id,
  });
  res.json(enabled);
};

export const disable = async (req: Request, res: Response): Promise<void> => {
  const disabled = await prisma.target.update({
    where: { id: res.locals.id },
    data: { disabled: true },
  });
  await removeTarget(disabled.id);
  logger.info("Target disabled", {
    component: LogComponent.Target,
    event: LogEvent.TargetDisabled,
    result: LogResult.Success,
    target_id: disabled.id,
  });
  res.json(disabled);
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
    skipDuplicates: true,
  });

  await enqueuePageLoads(addedPages);

  logger.info("Target pages created", {
    component: LogComponent.Target,
    event: LogEvent.TargetPagesCreated,
    result: LogResult.Success,
    target_id: target.id,
    count: addedPages.length,
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
