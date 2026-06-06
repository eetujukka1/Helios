import { QueuePage } from "../types.js";
import { DelayedError, Job } from "bullmq";
import { isAxiosError } from "axios";
import * as cheerio from "cheerio";
import { PageCreate } from "@helios/shared";
import add from "../services/pages.js";
import addResponse from "../services/responses.js";
import { resolveHref } from "./resolveHref.js";
import { getRandomProxy, getTarget, proxyGet } from "@helios/queue";

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

async function processJob(
  // eslint-disable-next-line
  job: Job<QueuePage, any, string>,
  token?: string,
): Promise<void> {
  const page = job.data;
  const proxy = await getRandomProxy();
  const target = await getTarget(page.targetId);

  if (proxy !== null && target !== null) {
    const response = await proxyGet<string>(proxy, page.url, {
      headers: pageLoadHeaders,
      responseType: "text",
      timeout: pageLoadTimeoutMs,
      validateStatus: () => true,
    }).catch((error: unknown) => {
      logAxiosError("Page load failed before response", error);
      throw error;
    });

    if (response.data && typeof response.data === "string") {
      await addResponse(
        page.id,
        { statusCode: response.status },
        response.data,
      ).catch((error: unknown) => {
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
