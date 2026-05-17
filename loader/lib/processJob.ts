import { QueuePage } from "../types.js";
import { DelayedError, Job } from "bullmq";
import axios, { isAxiosError } from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import * as cheerio from "cheerio";
import { PageCreate, Proxy } from "@helios/shared";
import add from "../services/pages.js";
import addResponse from "../services/responses.js";
import { resolveHref } from "./resolveHref.js";
import { getRandomProxy } from "@helios/queue";

const noProxyRetryDelayMs = 4000;
const pageLoadTimeoutMs = 30000;
const pageLoadHeaders = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

function logAxiosError(context: string, error: unknown): void {
  if (isAxiosError(error)) {
    console.error(context, {
      message: error.message,
      method: error.config?.method,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      status: error.response?.status,
      data: error.response?.data,
    });
    return;
  }

  console.error(context, error);
}

function getProxyUrl(proxy: Proxy): string {
  const url = new URL(`http://${proxy.host}:${proxy.port}`);

  if (proxy.username && proxy.password) {
    url.username = proxy.username;
    url.password = proxy.password;
  }

  return url.toString();
}

async function processJob(
  job: Job<QueuePage, any, string>,
  token?: string,
): Promise<void> {
  const page = job.data;

  const proxy = await getRandomProxy();
  if (proxy !== null) {
    const proxyAgent = new HttpsProxyAgent(getProxyUrl(proxy));
    const response = await axios
      .get<string>(page.url, {
        headers: pageLoadHeaders,
        httpAgent: proxyAgent,
        httpsAgent: proxyAgent,
        proxy: false,
        responseType: "text",
        timeout: pageLoadTimeoutMs,
        validateStatus: () => true,
      })
      .catch((error: unknown) => {
        logAxiosError("Page load failed before response", error);
        throw error;
      });

    if (response.data && typeof response.data === "string") {
      await addResponse(page.id, { statusCode: response.status }, response.data)
        .catch((error: unknown) => {
          logAxiosError("Saving page response failed", error);
          throw error;
        });
      const parser = cheerio.load(response.data);
      const sourceUrl = new URL(page.url);
      const nextPages: PageCreate[] = parser("a")
        .toArray()
        .map((element) => parser(element).attr("href"))
        .filter((href): href is string => typeof href === "string")
        .flatMap((href) => {
          const resolvedUrl = resolveHref(href, sourceUrl);

          if (
            resolvedUrl &&
            (resolvedUrl.protocol === "http:" ||
              resolvedUrl.protocol === "https:") &&
            resolvedUrl.hostname === sourceUrl.hostname
          ) {
            return [{ url: resolvedUrl.toString() }];
          }

          return [];
        });
      if (nextPages.length > 0) {
        await add(nextPages, page.targetId).catch((error: unknown) => {
          logAxiosError("Adding discovered pages failed", error);
          throw error;
        });
      }
    }
  } else {
    await job.moveToDelayed(Date.now() + noProxyRetryDelayMs, token);
    throw new DelayedError();
  }
}

export default processJob;
