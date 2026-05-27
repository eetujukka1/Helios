import dotenv from "dotenv";
import { envService } from "./services/envService.js";

const env = envService.get("NODE_ENV");

dotenv.config({
  path: env ? `../.env.${env}` : "../.env",
});

const { default: app } = await import("./app.js");
const { LogComponent, LogEvent, LogResult } = await import(
  "./config/logAttributes.js"
);
const { logger } = await import("./services/logger.js");
const { shutdownPostHog } = await import("./posthog.js");
const { loadPages } = await import("./utils/loadPages.js");
const { loadProxies } = await import("./utils/loadProxies.js");
const { loadTargets } = await import("./utils/loadTargets.js");

await loadPages();
await loadProxies();
await loadTargets();

const PORT = envService.get("PORT") || 3000;

const server = app.listen(PORT, () =>
  logger.info(`Server running on http://localhost:${PORT}`, {
    component: LogComponent.Backend,
    event: LogEvent.BackendStarted,
    result: LogResult.Success,
    port: PORT,
  }),
);

let isShuttingDown = false;

async function shutdown(signal: NodeJS.Signals) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  logger.info(`Received ${signal}, shutting down...`, {
    component: LogComponent.Backend,
    event: LogEvent.BackendShutdownRequested,
    signal,
  });

  server.close(async (error) => {
    try {
      if (error) {
        logger.error("Error closing server", error, {
          component: LogComponent.Backend,
          event: LogEvent.BackendServerCloseFailed,
          result: LogResult.Failure,
        });
      }

      await shutdownPostHog();
    } catch (shutdownError) {
      logger.fatal("Error during shutdown", shutdownError, {
        component: LogComponent.Backend,
        event: LogEvent.BackendShutdownFailed,
        result: LogResult.Failure,
      });
      process.exit(1);
    }

    process.exit(error ? 1 : 0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
