import { loadTargetsToCache } from "../services/targetCache.js";
import { obliterateTarget } from "@helios/queue";

import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

export const loadTargets = async (): Promise<void> => {
  await obliterateTarget();

  const targets = await prisma.target.findMany({
    where: {
      disabled: false
    }
  })

  if (targets.length > 0) {
    await loadTargetsToCache(targets);
  }
}