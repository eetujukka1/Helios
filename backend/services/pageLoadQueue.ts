import { createPageLoadQueue, createRedisConnection } from "@helios/queue";
import { Page } from "@helios/shared";

type PageLoadJob = Pick<Page, "id" | "targetId" | "url">;

export async function enqueuePageLoads(pages: PageLoadJob[]): Promise<void> {
  const pageLoadQueue = createPageLoadQueue(createRedisConnection());

  try {
    await pageLoadQueue.addBulk(
      pages.map((page) => ({
        name: "load",
        data: { id: page.id, targetId: page.targetId, url: page.url },
      })),
    );
  } finally {
    await pageLoadQueue.close();
  }
}

export async function obliteratePageQueue(): Promise<void> {
  const pageLoadQueue = createPageLoadQueue(createRedisConnection());
  try {
    await pageLoadQueue.obliterate({ force: true });
  } finally {
    await pageLoadQueue.close();
  }
}
