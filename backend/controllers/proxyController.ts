import * as z from "zod";
import { PrismaClient } from "../generated/prisma/client.js";
import { Request, Response } from "express";
import { ProxyCreateSchema, ProxyUpdateSchema } from "@helios/shared";
import { addProxy, bulkAddProxy, removeProxy } from "@helios/queue";

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
  await bulkAddProxy(
    addedProxies.map(proxy => ({ id: proxy.id, value: proxy })),
  );
  res.status(201).json(addedProxies);
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const deleted = await prisma.proxy.delete({ where: { id: res.locals.id } });
  await removeProxy(deleted.id);
  res.json(deleted);
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const proxy = ProxyUpdateSchema.parse(req.body);
  const updated = await prisma.proxy.update({
    where: { id: res.locals.id },
    data: proxy,
  });
  res.json(updated);
};


export const enable = async (req: Request, res: Response): Promise<void> => {
  const enabled = await prisma.proxy.update({
    where: { id: res.locals.id },
    data: { disabled: false }
  });
  await addProxy(enabled.id, enabled);
  res.json(enabled);
};

export const disable = async (req: Request, res: Response): Promise<void> => {
  const disabled = await prisma.proxy.update({
    where: { id: res.locals.id },
    data: { disabled: true }
  });
  await removeProxy(disabled.id)
  res.json(disabled)
};