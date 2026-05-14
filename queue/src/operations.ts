import type { RedisClient, RedisService } from "./redis.js";
import { createRedisService } from "./redis.js";

export type RedisKeyId = string | number;
export type RedisStoredValue = string | number | boolean | object | null;

export type RedisOperationOptions<TValue = RedisStoredValue> = {
  client?: RedisClient;
  separator?: string;
  serialize?: (value: TValue) => string;
  deserialize?: (value: string) => TValue;
};

let defaultRedisService: RedisService | undefined;

const getDefaultRedisService = (): RedisService => {
  defaultRedisService ??= createRedisService();

  return defaultRedisService;
};

const getRedisClient = (client?: RedisClient): RedisClient =>
  client ?? getDefaultRedisService().getClient();

const createRedisKey = (
  keyPrefix: string,
  id: RedisKeyId,
  separator = ":",
): string => `${keyPrefix}${separator}${id}`;

const serializeValue = <TValue>(value: TValue): string => {
  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify(value);
};

const deserializeValue = <TValue>(value: string): TValue => {
  try {
    return JSON.parse(value) as TValue;
  } catch {
    return value as TValue;
  }
};

export function createGetOperation<TValue = RedisStoredValue>(
  keyPrefix: string,
  options: RedisOperationOptions<TValue> = {},
): (id: RedisKeyId) => Promise<TValue | null> {
  const deserialize = options.deserialize ?? deserializeValue<TValue>;

  return async (id: RedisKeyId): Promise<TValue | null> => {
    const value = await getRedisClient(options.client).get(
      createRedisKey(keyPrefix, id, options.separator),
    );

    return value === null ? null : deserialize(value);
  };
}

export function createAddOperation<TValue = RedisStoredValue>(
  keyPrefix: string,
  options: RedisOperationOptions<TValue> = {},
): (id: RedisKeyId, value: TValue) => Promise<"OK" | null> {
  const serialize = options.serialize ?? serializeValue<TValue>;

  return (id: RedisKeyId, value: TValue): Promise<"OK" | null> =>
    getRedisClient(options.client).set(
      createRedisKey(keyPrefix, id, options.separator),
      serialize(value),
    );
}

export function createDeleteOperation(
  keyPrefix: string,
  options: Pick<RedisOperationOptions, "client" | "separator"> = {},
): (id: RedisKeyId) => Promise<number> {
  return (id: RedisKeyId): Promise<number> =>
    getRedisClient(options.client).del(
      createRedisKey(keyPrefix, id, options.separator),
    );
}

export async function closeDefaultRedisOperationClient(): Promise<void> {
  await defaultRedisService?.close();
  defaultRedisService = undefined;
}
