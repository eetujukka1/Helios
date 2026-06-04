import * as z from "zod";
import { prisma } from "../services/prisma.js";
import { Request, Response } from "express";
import {
  ProxyCreateSchema,
  ProxyUpdateSchema,
  type Proxy,
} from "@helios/shared";
import { addProxy, bulkAddProxy, removeProxy } from "@helios/queue";
import { LogComponent, LogEvent, LogResult } from "../config/logAttributes.js";
import { logger } from "../services/logger.js";

const redactProxyPassword = <T extends { password?: string | null }>(
  proxy: T,
): Omit<T, "password"> => {
  const redactedProxy = { ...proxy };
  delete redactedProxy.password;
  return redactedProxy;
};

const redactProxyPasswords = <T extends { password?: string | null }>(
  proxies: T[],
): Omit<T, "password">[] => proxies.map(redactProxyPassword);

export const getAll = async (req: Request, res: Response): Promise<void> => {
  const proxies = await prisma.proxy.findMany();
  res.json(redactProxyPasswords(proxies));
};

export const getOne = async (req: Request, res: Response): Promise<void> => {
  const proxy = await prisma.proxy.findFirst({ where: { id: res.locals.id } });
  res.json(proxy ? redactProxyPassword(proxy) : null);
};

export const getAmount = async (req: Request, res: Response): Promise<void> => {
  const amount = await prisma.proxy.count();
  res.json({ amount });
};

export const add = async (req: Request, res: Response): Promise<void> => {
  const proxies = z.array(ProxyCreateSchema).parse(req.body.proxies);
  const addedProxies: Proxy[] = await prisma.proxy.createManyAndReturn({
    data: proxies,
  });
  await bulkAddProxy(
    addedProxies.map((proxy) => ({ id: proxy.id, value: proxy })),
  );
  logger.info("Proxies created", {
    component: LogComponent.Proxy,
    event: LogEvent.ProxyCreated,
    result: LogResult.Success,
    count: addedProxies.length,
  });
  res.status(201).json(redactProxyPasswords(addedProxies));
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const deleted = await prisma.proxy.delete({ where: { id: res.locals.id } });
  await removeProxy(deleted.id);
  logger.info("Proxy deleted", {
    component: LogComponent.Proxy,
    event: LogEvent.ProxyDeleted,
    result: LogResult.Success,
    proxy_id: deleted.id,
  });
  res.json(redactProxyPassword(deleted));
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const proxy = ProxyUpdateSchema.parse(req.body);
  const updated = await prisma.proxy.update({
    where: { id: res.locals.id },
    data: proxy,
  });
  logger.info("Proxy updated", {
    component: LogComponent.Proxy,
    event: LogEvent.ProxyUpdated,
    result: LogResult.Success,
    proxy_id: updated.id,
  });
  res.json(redactProxyPassword(updated));
};

export const enable = async (req: Request, res: Response): Promise<void> => {
  const enabled = await prisma.proxy.update({
    where: { id: res.locals.id },
    data: { disabled: false },
  });
  await addProxy(enabled.id, enabled);
  logger.info("Proxy enabled", {
    component: LogComponent.Proxy,
    event: LogEvent.ProxyEnabled,
    result: LogResult.Success,
    proxy_id: enabled.id,
  });
  res.json(redactProxyPassword(enabled));
};

export const disable = async (req: Request, res: Response): Promise<void> => {
  const disabled = await prisma.proxy.update({
    where: { id: res.locals.id },
    data: { disabled: true },
  });
  await removeProxy(disabled.id);
  logger.info("Proxy disabled", {
    component: LogComponent.Proxy,
    event: LogEvent.ProxyDisabled,
    result: LogResult.Success,
    proxy_id: disabled.id,
  });
  res.json(redactProxyPassword(disabled));
};
