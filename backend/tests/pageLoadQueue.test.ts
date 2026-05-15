import { jest, describe, beforeEach, it, expect } from "@jest/globals";

const mockAddBulk = jest.fn<(jobs: unknown[]) => Promise<void>>();
const mockClose = jest.fn<() => Promise<void>>();
const mockObliterate =
  jest.fn<(options: { force: boolean }) => Promise<void>>();
const mockConnection = { host: "redis" };

jest.unstable_mockModule("@helios/queue", () => ({
  createRedisConnection: jest.fn(() => mockConnection),
  createPageLoadQueue: jest.fn(() => ({
    addBulk: mockAddBulk,
    close: mockClose,
    obliterate: mockObliterate,
  })),
}));

const { enqueuePageLoads, obliteratePageQueue } =
  await import("../services/pageLoadQueue.js");

beforeEach(() => {
  mockAddBulk.mockReset();
  mockClose.mockReset();
  mockObliterate.mockReset();
});

describe("enqueuePageLoads", () => {
  it("adds page id to page load jobs", async () => {
    mockAddBulk.mockResolvedValue();
    mockClose.mockResolvedValue();

    await enqueuePageLoads([
      { id: 1, targetId: 2, url: "https://example.com" },
      { id: 3, targetId: 4, url: "https://example.com/about" },
    ]);

    expect(mockAddBulk).toHaveBeenCalledWith([
      {
        name: "load",
        data: { id: 1, targetId: 2, url: "https://example.com" },
      },
      {
        name: "load",
        data: { id: 3, targetId: 4, url: "https://example.com/about" },
      },
    ]);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});

describe("obliteratePageQueue", () => {
  it("closes the queue after obliterating it", async () => {
    mockObliterate.mockResolvedValue();
    mockClose.mockResolvedValue();

    await obliteratePageQueue();

    expect(mockObliterate).toHaveBeenCalledWith({ force: true });
    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});
