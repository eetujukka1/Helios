import { bulkAddProxy } from "@helios/queue";
import type { Proxy } from "@helios/shared";
import { LogComponent, LogEvent, LogResult } from "../config/logAttributes.js";
import { logger } from "./logger.js";

export async function loadProxiesToCache(proxies: Proxy[]): Promise<void> {
  await bulkAddProxy(proxies.map((proxy) => ({ id: proxy.id, value: proxy })));
  logger.info("Proxies loaded to cache", {
    component: LogComponent.Proxy,
    event: LogEvent.ProxyCacheLoaded,
    result: LogResult.Success,
    count: proxies.length,
  });
}
