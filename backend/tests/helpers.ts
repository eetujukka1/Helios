import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";
import { envService } from "../services/envService.js";

export const SECRET = "testsecret";

export function setupEnv() {
  envService.set("JWT_SECRET", SECRET);
  envService.set("DEMO_USER_USERNAME", "admin");
  envService.set("DEMO_USER_PASSWORD", "password123");
  envService.set("DEMO_WORKER_ID", "worker");
  envService.set("DEMO_WORKER_SECRET", "secretkey");
}

export function authToken(): string {
  return jwt.sign({ actorType: "user", username: "admin" }, SECRET);
}

export function workerAuthToken(): string {
  return jwt.sign({ actorType: "worker", workerId: "worker" }, SECRET);
}

export const mockEnqueuePageLoads = jest.fn<() => Promise<void>>();
export const mockAddProxy = jest.fn<() => Promise<void>>();
export const mockBulkAddProxy = jest.fn<() => Promise<void>>();
export const mockRemoveProxy = jest.fn<() => Promise<void>>();
export const mockAddTarget = jest.fn<() => Promise<void>>();
export const mockBulkAddTarget = jest.fn<() => Promise<void>>();
export const mockRemoveTarget = jest.fn<() => Promise<void>>();

type MockUploadObjectInput = {
  key: string;
  body: Buffer;
  contentType?: string;
  metadata?: Record<string, string>;
};

export const mockUploadObject =
  jest.fn<(input: MockUploadObjectInput) => Promise<object>>();

export const mockFile = {
  findMany: jest.fn<(args?: unknown) => Promise<object[]>>(),
  findFirst: jest.fn<(args?: unknown) => Promise<object | null>>(),
  createManyAndReturn: jest.fn<(args?: unknown) => Promise<object[]>>(),
  delete: jest.fn<(args?: unknown) => Promise<object | null>>(),
};

export const mockPage = {
  findMany: jest.fn<(args?: unknown) => Promise<object[]>>(),
  findFirst: jest.fn<(args?: unknown) => Promise<object | null>>(),
  createManyAndReturn: jest.fn<(args?: unknown) => Promise<object[]>>(),
  create: jest.fn<(args?: unknown) => Promise<object>>(),
  findUniqueOrThrow: jest.fn<(args?: unknown) => Promise<object | null>>(),
};

export const mockResponse = {
  findMany: jest.fn<(args?: unknown) => Promise<object[]>>(),
  findFirst: jest.fn<(args?: unknown) => Promise<object | null>>(),
  createManyAndReturn: jest.fn<(args?: unknown) => Promise<object[]>>(),
  create: jest.fn<(args?: unknown) => Promise<object>>(),
  findUniqueOrThrow: jest.fn<(args?: unknown) => Promise<object | null>>(),
};

export const mockProxy = {
  findMany: jest.fn<(args?: unknown) => Promise<object[]>>(),
  findFirst: jest.fn<(args?: unknown) => Promise<object | null>>(),
  createManyAndReturn: jest.fn<(args?: unknown) => Promise<object[]>>(),
  update:
    jest.fn<
      (args?: { where: { id: number }; data: object }) => Promise<object | null>
    >(),
  delete: jest.fn<(args?: unknown) => Promise<object | null>>(),
};

export const mockTarget = {
  findMany: jest.fn<(args?: unknown) => Promise<object[]>>(),
  findUniqueOrThrow: jest.fn<(args?: unknown) => Promise<object | null>>(),
  findFirst: jest.fn<(args?: unknown) => Promise<object | null>>(),
  createManyAndReturn: jest.fn<(args?: unknown) => Promise<object[]>>(),
  delete: jest.fn<(args?: unknown) => Promise<object>>(),
};

export const mockPrismaClient = {
  file: mockFile,
  page: mockPage,
  response: mockResponse,
  proxy: mockProxy,
  target: mockTarget,
};

export function setupPrismaMockClient(): void {
  jest.unstable_mockModule("@helios/queue", () => ({
    addProxy: mockAddProxy,
    bulkAddProxy: mockBulkAddProxy,
    removeProxy: mockRemoveProxy,
    addTarget: mockAddTarget,
    bulkAddTarget: mockBulkAddTarget,
    removeTarget: mockRemoveTarget,
  }));
  jest.unstable_mockModule("../services/pageLoadQueue.js", () => ({
    enqueuePageLoads: mockEnqueuePageLoads,
  }));
  jest.unstable_mockModule("../services/s3Service.js", () => ({
    createS3Service: jest.fn(() => ({
      uploadObject: mockUploadObject,
    })),
  }));
}

export function resetMockClient(): void {
  for (const model of Object.values(mockPrismaClient)) {
    for (const method of Object.values(model)) {
      method.mockReset();
    }
  }
  mockEnqueuePageLoads.mockReset();
  mockAddProxy.mockReset();
  mockBulkAddProxy.mockReset();
  mockRemoveProxy.mockReset();
  mockAddTarget.mockReset();
  mockBulkAddTarget.mockReset();
  mockRemoveTarget.mockReset();
  mockUploadObject.mockReset();
}
