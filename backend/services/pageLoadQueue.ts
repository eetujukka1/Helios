import { createPageLoadQueue, createRedisConnection } from "@helios/queue";

type PageLoadJob = {
  id: number;
  url: string;
};

export async function enqueuePageLoads(
  pages: PageLoadJob[],
): Promise<void> {
  const pageLoadQueue = createPageLoadQueue(createRedisConnection());

  try {
    await pageLoadQueue.addBulk(
      pages.map((page) => ({
        name: "load",
        data: { id: page.id, url: page.url },
      })),
    );
  } finally {
    await pageLoadQueue.close();
  }
}
