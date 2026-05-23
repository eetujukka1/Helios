import { bulkAddProxy } from "@helios/queue";
import type { Proxy } from "@helios/shared";

export async function loadProxiesToCache(proxies: Proxy[]): Promise<void> {
  await bulkAddProxy(proxies.map((proxy) => ({ id: proxy.id, value: proxy })));
}
