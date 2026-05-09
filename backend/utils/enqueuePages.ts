import { enqueuePageLoads, obliteratePageQueue } from "../services/pageLoadQueue.js";
import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

export async function scheduleMissedPages() {
  obliteratePageQueue();
  
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
