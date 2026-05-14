import {
  createEnvService,
  type EnvService,
  type EnvValues,
} from "@helios/shared";
import type { QueueOptions } from "bullmq";

export type RedisConnection = NonNullable<QueueOptions["connection"]>;

const isEnvService = (env?: EnvService | EnvValues): env is EnvService =>
  typeof (env as EnvService | undefined)?.get === "function";

const createRedisEnvService = (env?: EnvService | EnvValues): EnvService =>
  isEnvService(env) ? env : createEnvService(env);

export function createRedisConnection(
  env?: EnvService | EnvValues,
): RedisConnection {
  const envService = createRedisEnvService(env);

  return {
    host: envService.get("REDIS_HOST") ?? "localhost",
    port: Number.parseInt(envService.get("REDIS_PORT") ?? "6379", 10),
    username: envService.get("REDIS_USERNAME") ?? "default",
    password: envService.get("REDIS_PASSWORD") ?? undefined,
  };
}
