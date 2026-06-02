import { createPageLoadQueue, createRedisConnection } from "@helios/queue";
import { Page } from "@helios/shared";
import { LogComponent, LogEvent, LogResult } from "../config/logAttributes.js";
import { logger } from "./logger.js";

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
    logger.info("Page load jobs queued", {
      component: LogComponent.Queue,
      event: LogEvent.PageLoadQueued,
      result: LogResult.Success,
      count: pages.length,
    });
  } finally {
    await pageLoadQueue.close();
  }
}

export async function obliteratePageQueue(): Promise<void> {
  const pageLoadQueue = createPageLoadQueue(createRedisConnection());
  try {
    await pageLoadQueue.obliterate({ force: true });
    logger.info("Page load queue cleared", {
      component: LogComponent.Queue,
      event: LogEvent.PageLoadQueueCleared,
      result: LogResult.Success,
    });
  } finally {
    await pageLoadQueue.close();
  }
}
