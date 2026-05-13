import type { QueueOptions } from "bullmq";

export type RedisConnection = NonNullable<QueueOptions["connection"]>;

export function createRedisConnection(
  env: NodeJS.ProcessEnv = process.env,
): RedisConnection {
  return {
    host: env.REDIS_HOST ?? "localhost",
    port: Number.parseInt(env.REDIS_PORT ?? "6379", 10),
    username: env.REDIS_USERNAME ?? "default",
    password: env.REDIS_PASSWORD ?? undefined,
  };
}
