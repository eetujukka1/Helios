import { createEnvService } from "@helios/shared";
import { jest, describe, beforeEach, it, expect } from "@jest/globals";

const workerConstructor = jest.fn();
const createRedisConnection = jest.fn(() => ({ redis: "connection" }));
const processJob = jest.fn();

jest.unstable_mockModule("bullmq", () => ({
  Worker: workerConstructor,
}));

jest.unstable_mockModule("@helios/queue", () => ({
  createRedisConnection,
  queueNames: { pageLoad: "page-load" },
}));

jest.unstable_mockModule("../lib/processJob.js", () => ({
  default: processJob,
}));

const { default: createWorker, getLoaderConcurrency } =
  await import("../createWorker.js");

beforeEach(() => {
  workerConstructor.mockClear();
  processJob.mockClear();
  delete process.env.LOADER_CONCURRENCY;
});

describe("getLoaderConcurrency", () => {
  it("defaults loader concurrency to 5", () => {
    expect(getLoaderConcurrency(createEnvService({}))).toBe(5);
  });

  it("reads a positive integer LOADER_CONCURRENCY value", () => {
    expect(
      getLoaderConcurrency(createEnvService({ LOADER_CONCURRENCY: "8" })),
    ).toBe(8);
  });

  it.each(["0", "-1", "1.5", "many"])(
    "rejects invalid LOADER_CONCURRENCY value %s",
    (value) => {
      expect(() =>
        getLoaderConcurrency(createEnvService({ LOADER_CONCURRENCY: value })),
      ).toThrow("LOADER_CONCURRENCY must be a positive integer");
    },
  );
});

describe("createWorker", () => {
  it("passes default concurrency to the BullMQ worker", () => {
    createWorker();

    expect(workerConstructor).toHaveBeenCalledWith(
      "page-load",
      expect.any(Function),
      expect.objectContaining({
        concurrency: 5,
        connection: { redis: "connection" },
      }),
    );
  });

  it("passes configured concurrency to the BullMQ worker", () => {
    process.env.LOADER_CONCURRENCY = "3";

    createWorker();

    expect(workerConstructor).toHaveBeenCalledWith(
      "page-load",
      expect.any(Function),
      expect.objectContaining({ concurrency: 3 }),
    );
  });
});
