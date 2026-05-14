import { QueuePage } from "../types.js";
import { loadDefaultPage } from "jsilk";
import * as cheerio from "cheerio";
import { PageCreate } from "@helios/shared";
import add from "../services/pages.js";
import addResponse from "../services/responses.js";
import { resolveHref } from "./resolveHref.js";

async function processJob(page: QueuePage): Promise<void> {
  const pageToLoad = {
    url: page.url,
    content: null,
    status: null,
    lastLoaded: null,
  };
  const loadedPage = await loadDefaultPage(pageToLoad);

  if (loadedPage.content && typeof loadedPage.content === "string") {
    if (typeof loadedPage.status !== "number") {
      throw new Error(`Loaded page ${page.url} is missing a response status`);
    }

    await addResponse(
      page.id,
      { statusCode: loadedPage.status },
      loadedPage.content,
    );

    const parser = cheerio.load(loadedPage.content);
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
      await add(nextPages, page.targetId);
    }
  }
}

export default processJob;
