import {
  enqueuePageLoads,
  obliteratePageQueue,
} from "../services/pageLoadQueue.js";
import { prisma } from "../services/prisma.js";

export async function loadPages() {
  await obliteratePageQueue();

  const pages = await prisma.page.findMany({
    where: {
      response: {
        none: {},
      },
    },
  });

  if (pages.length > 0) {
    await enqueuePageLoads(pages);
  }
}
