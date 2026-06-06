import { prisma } from "../services/prisma.js";
import { Request, Response } from "express";

export const getAmount = async (req: Request, res: Response): Promise<void> => {
  const statusCode =
    typeof req.query.statusCode === "string"
      ? Number.parseInt(req.query.statusCode, 10)
      : undefined;

  const group =
    typeof req.query.group === "string"
      ? req.query.group === "true"
      : undefined;

  if (group) {
    const response = await prisma.response.groupBy({
      by: ["statusCode"],
      _count: {
        _all: true,
      },
      where: Number.isNaN(statusCode) ? undefined : { statusCode },
    });
    res.json(
      response.map((item) => ({
        statusCode: item.statusCode,
        count: item._count._all,
      })),
    );
    return;
  }

  const amount = await prisma.response.count({
    where: Number.isNaN(statusCode) ? undefined : { statusCode },
  });
  res.json({
    statusCode: statusCode ? statusCode : undefined,
    count: amount,
  });
};
