import { bulkAddTarget } from "@helios/queue";
import type { Target } from "@helios/shared";
import { LogComponent, LogEvent, LogResult } from "../config/logAttributes.js";
import { logger } from "./logger.js";

export async function loadTargetsToCache(targets: Target[]): Promise<void> {
  await bulkAddTarget(
    targets.map((target) => ({ id: target.id, value: target })),
  );
  logger.info("Targets loaded to cache", {
    component: LogComponent.Target,
    event: LogEvent.TargetCacheLoaded,
    result: LogResult.Success,
    count: targets.length,
  });
}
