import { QueuePage } from "../types.js";
import postResult from "./postResult.js";

async function processJob(page: QueuePage): Promise<void> {
  const suffixMatch = page.url.match(/(\d+)$/);

  const nextPages = !suffixMatch
    ? [{ ...page, url: `${page.url}1` }]
    : (() => {
        const [currentSuffix] = suffixMatch;
        const nextSuffix = String(Number(currentSuffix) + 1).padStart(
          currentSuffix.length,
          "0",
        );

        return [
          {
            targetId: page.targetId,
            url: `${page.url.slice(0, -currentSuffix.length)}${nextSuffix}`,
          },
        ];
      })();

  await postResult(
    nextPages.map(({ url }) => ({ url })),
    page.targetId,
  );
}

export default processJob;
