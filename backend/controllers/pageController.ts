import { randomUUID } from "node:crypto";
import { prisma } from "../services/prisma.js";
import { Request, Response } from "express";
import { ResponseCreateSchema } from "@helios/shared";
import { createS3Service } from "../services/s3Service.js";
import { LogComponent, LogEvent, LogResult } from "../config/logAttributes.js";
import { logger } from "../services/logger.js";

export const getAll = async (req: Request, res: Response): Promise<void> => {
  const pages = await prisma.page.findMany();
  res.json(pages);
};

export const getOne = async (req: Request, res: Response): Promise<void> => {
  const page = await prisma.page.findFirst({ where: { id: res.locals.id } });
  res.json(page);
};

export const getAmount = async (req: Request, res: Response): Promise<void> => {
  const amount = await prisma.page.count();
  res.json({ amount });
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

export const addResponse = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const response = ResponseCreateSchema.parse(req.body);
  const contentsFile = req.file;
  const s3Key = contentsFile ? randomUUID() : undefined;

  if (contentsFile && s3Key) {
    await createS3Service().uploadObject({
      key: s3Key,
      body: contentsFile.buffer,
      contentType: contentsFile.mimetype,
      metadata: {
        originalName: contentsFile.originalname,
      },
    });
  }

  // eslint-disable-next-line
  const responseData: any = {
    page: {
      connect: { id: res.locals.id },
    },
    statusCode: response.statusCode,
  };

  if (response.proxyId) {
    responseData.proxy = { connect: { id: response.proxyId } };
  }

  if (s3Key) {
    responseData.file = { create: { name: s3Key } };
  } else if (response.fileId) {
    responseData.file = { connect: { id: response.fileId } };
  }

  const addedResponse = await prisma.response.create({
    data: responseData,
  });

  logger.info("Page response created", {
    component: LogComponent.Page,
    event: LogEvent.PageResponseCreated,
    result: LogResult.Success,
    page_id: res.locals.id,
    proxy_id: response.proxyId,
    response_id: addedResponse.id,
    status_code: response.statusCode,
  });

  res.status(201).json(addedResponse);
};
