import { Redis, type RedisOptions } from "ioredis";
import type { EnvService, EnvValues } from "@helios/shared";
import { createRedisConnection, type RedisConnection } from "./connection.js";

export type RedisClient = Redis;

export type RedisServiceOptions = {
  client?: RedisClient;
  connection?: RedisConnection;
  env?: EnvService | EnvValues;
};

export class RedisService {
  private readonly client: RedisClient;
  private readonly shouldCloseClient: boolean;

  constructor(options: RedisServiceOptions = {}) {
    if (options.client) {
      this.client = options.client;
      this.shouldCloseClient = false;
      return;
    }

    const connection = options.connection ?? createRedisConnection(options.env);

    this.client = new Redis(connection as RedisOptions);
    this.shouldCloseClient = true;
  }

  getClient(): RedisClient {
    return this.client;
  }

  async close(): Promise<void> {
    if (!this.shouldCloseClient || this.client.status === "end") {
      return;
    }

    await this.client.quit();
  }
}

export const createRedisService = (
  env?: EnvService | EnvValues,
): RedisService => new RedisService({ env });
