import { Queue, type QueueOptions } from "bullmq";

export const queueNames = {
  pageLoad: "page-load",
  pageParse: "page-parse",
} as const;

export type QueueConnection = NonNullable<QueueOptions["connection"]>;

export function createPageLoadQueue(connection: QueueConnection): Queue {
  return new Queue(queueNames.pageLoad, { connection });
}

export function createPageParseQueue(connection: QueueConnection): Queue {
  return new Queue(queueNames.pageParse, { connection });
}

export function createQueues(connection: QueueConnection) {
  return {
    pageLoadQueue: createPageLoadQueue(connection),
    pageParseQueue: createPageParseQueue(connection),
  };
}
