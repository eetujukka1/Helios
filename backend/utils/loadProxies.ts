import { loadProxiesToCache } from "../services/proxyCache.js";
import { obliterateProxy } from "@helios/queue";
import { prisma } from "../services/prisma.js";

export const loadProxies = async () => {
  await obliterateProxy();

  const proxies = await prisma.proxy.findMany({
    where: {
      disabled: false,
    },
  });

  if (proxies.length > 0) {
    await loadProxiesToCache(proxies);
  }
};
