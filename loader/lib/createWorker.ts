import { createRedisConnection, queueNames } from "@helios/queue";
import { Job, Worker } from "bullmq";
import { QueuePage } from "../types.js";
import processJob from "./processJob.js";

const connection = createRedisConnection();

function createWorker(): void {
  new Worker(
    queueNames.pageLoad,
    async (job: Job<QueuePage>) => processJob(job.data),
    {
      connection,
      removeOnComplete: { count: 0 },
      removeOnFail: { count: 0 },
    },
  );
}

export default createWorker;
