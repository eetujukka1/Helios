import { loadProxiesToCache } from "../services/proxyCache.js";
import { obliterateProxy } from "@helios/queue";
import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

export const loadProxies = async () => {
  await obliterateProxy();

  const proxies = await prisma.proxy.findMany({
    where: {
      disabled: false
    }
  })

  if (proxies.length > 0) {
    await loadProxiesToCache(proxies)
  }
}