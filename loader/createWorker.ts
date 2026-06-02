import { createRedisConnection, queueNames } from "@helios/queue";
import type { EnvService } from "@helios/shared";
import { type Job, Worker } from "bullmq";
import { QueuePage } from "./types.js";
import processJob from "./lib/processJob.js";
import { envService } from "./lib/envService.js";

const connection = createRedisConnection();

export const DEFAULT_LOADER_CONCURRENCY = 5;

export function getLoaderConcurrency(env: EnvService = envService): number {
  const value = env.get("LOADER_CONCURRENCY");

  if (value === undefined || value === "") {
    return DEFAULT_LOADER_CONCURRENCY;
  }

  const concurrency = Number(value);

  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new Error("LOADER_CONCURRENCY must be a positive integer");
  }

  return concurrency;
}

function createWorker(): Worker<QueuePage> {
  return new Worker<QueuePage>(
    queueNames.pageLoad,
    async (job: Job<QueuePage>, token?: string) => processJob(job, token),
    {
      connection,
      concurrency: getLoaderConcurrency(),
      removeOnComplete: { count: 0 },
      removeOnFail: { count: 0 },
    },
  );
}

export default createWorker;
