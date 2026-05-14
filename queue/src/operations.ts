import type { RedisClient, RedisService } from "./redis.js";
import { createRedisService } from "./redis.js";

export type RedisKeyId = string | number;
export type RedisStoredValue = string | number | boolean | object | null;

export type RedisOperationOptions<TValue = RedisStoredValue> = {
  client?: RedisClient;
  serialize?: (value: TValue) => string;
  deserialize?: (value: string) => TValue;
};

export type RedisGetRandomOperationOptions<TValue = RedisStoredValue> =
  RedisOperationOptions<TValue> & {
    scanCount?: number;
  };

let defaultRedisService: RedisService | undefined;

const getDefaultRedisService = (): RedisService => {
  defaultRedisService ??= createRedisService();

  return defaultRedisService;
};

const getRedisClient = (client?: RedisClient): RedisClient =>
  client ?? getDefaultRedisService().getClient();

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
      `${keyPrefix}:${id}`,
    );

    return value === null ? null : deserialize(value);
  };
}

export function createGetRandomOperation<TValue = RedisStoredValue>(
  keyPrefix: string,
  options: RedisGetRandomOperationOptions<TValue> = {},
): () => Promise<TValue | null> {
  const deserialize = options.deserialize ?? deserializeValue<TValue>;

  return async (): Promise<TValue | null> => {
    const client = getRedisClient(options.client);
    const pattern = `${keyPrefix}:*`;
    const scanCount = options.scanCount ?? 100;
    let cursor = "0";
    let selectedKey: string | undefined;
    let seenKeys = 0;

    do {
      const [nextCursor, keys] = await client.scan(
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        scanCount,
      );

      cursor = nextCursor;

      for (const key of keys) {
        seenKeys += 1;

        if (Math.floor(Math.random() * seenKeys) === 0) {
          selectedKey = key;
        }
      }
    } while (cursor !== "0");

    if (!selectedKey) {
      return null;
    }

    const value = await client.get(selectedKey);

    return value === null ? null : deserialize(value);
  };
}

export function createAddOperation<TValue = RedisStoredValue>(
  keyPrefix: string,
  options: RedisOperationOptions<TValue> = {},
): (id: RedisKeyId, value: TValue) => Promise<"OK" | null> {
  const serialize = options.serialize ?? serializeValue<TValue>;

  return (id: RedisKeyId, value: TValue): Promise<"OK" | null> =>
    getRedisClient(options.client).set(`${keyPrefix}:${id}`, serialize(value));
}

export function createDeleteOperation(
  keyPrefix: string,
  options: Pick<RedisOperationOptions, "client"> = {},
): (id: RedisKeyId) => Promise<number> {
  return (id: RedisKeyId): Promise<number> =>
    getRedisClient(options.client).del(`${keyPrefix}:${id}`);
}

export async function closeDefaultRedisOperationClient(): Promise<void> {
  await defaultRedisService?.close();
  defaultRedisService = undefined;
}
