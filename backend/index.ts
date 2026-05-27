import dotenv from "dotenv";
import { envService } from "./services/envService.js";

const env = envService.get("NODE_ENV");

dotenv.config({
  path: env ? `../.env.${env}` : "../.env",
});

const { default: app } = await import("./app.js");
const { shutdownPostHog } = await import("./posthog.js");
const { loadPages } = await import("./utils/loadPages.js");
const { loadProxies } = await import("./utils/loadProxies.js");
const { loadTargets } = await import("./utils/loadTargets.js");

await loadPages();
await loadProxies();
await loadTargets();

const PORT = envService.get("PORT") || 3000;

const server = app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);

let isShuttingDown = false;

async function shutdown(signal: NodeJS.Signals) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log(`Received ${signal}, shutting down...`);

  server.close(async (error) => {
    try {
      if (error) {
        console.error("Error closing server:", error);
      }

      await shutdownPostHog();
    } catch (shutdownError) {
      console.error("Error during shutdown:", shutdownError);
      process.exit(1);
    }

    process.exit(error ? 1 : 0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
