import type { QueueOptions } from "bullmq";

export type RedisConnection = NonNullable<QueueOptions["connection"]>;

export function createRedisConnection(
  env: NodeJS.ProcessEnv = process.env,
): RedisConnection {
  const port = Number.parseInt(env.REDIS_PORT ?? "6379", 10);

  return {
    host: env.REDIS_HOST ?? "localhost",
    port: Number.isNaN(port) ? 6379 : port,
    username: env.REDIS_USERNAME ?? "default",
    password: env.REDIS_PASSWORD ?? undefined,
  };
}
