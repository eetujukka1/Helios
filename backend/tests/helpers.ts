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

export const mockFile = {
  findMany: jest.fn<() => Promise<object[]>>(),
  findFirst: jest.fn<() => Promise<object | null>>(),
  createManyAndReturn: jest.fn<() => Promise<object[]>>(),
  delete: jest.fn<() => Promise<object | null>>(),
};

export const mockPage = {
  findMany: jest.fn<() => Promise<object[]>>(),
  findFirst: jest.fn<() => Promise<object | null>>(),
  createManyAndReturn: jest.fn<() => Promise<object[]>>(),
  findUniqueOrThrow: jest.fn<() => Promise<object | null>>(),
};

export const mockResponse = {
  findMany: jest.fn<() => Promise<object[]>>(),
  findFirst: jest.fn<() => Promise<object | null>>(),
  createManyAndReturn: jest.fn<() => Promise<object[]>>(),
  findUniqueOrThrow: jest.fn<() => Promise<object | null>>(),
};

export const mockProxy = {
  findMany: jest.fn<() => Promise<object[]>>(),
  findFirst: jest.fn<() => Promise<object | null>>(),
  createManyAndReturn: jest.fn<() => Promise<object[]>>(),
  update:
    jest.fn<
      (args: { where: { id: number }; data: object }) => Promise<object | null>
    >(),
  delete: jest.fn<() => Promise<object | null>>(),
};

export const mockTarget = {
  findMany: jest.fn<() => Promise<object[]>>(),
  findUniqueOrThrow: jest.fn<() => Promise<object | null>>(),
  findFirst: jest.fn<() => Promise<object | null>>(),
  createManyAndReturn: jest.fn<() => Promise<object[]>>(),
  delete: jest.fn<() => Promise<object>>(),
};

const mockPrismaClient = {
  file: mockFile,
  page: mockPage,
  response: mockResponse,
  proxy: mockProxy,
  target: mockTarget,
};

export function setupPrismaMockClient(): void {
  jest.unstable_mockModule("../generated/prisma/client.js", () => ({
    PrismaClient: jest.fn(() => mockPrismaClient),
  }));
  jest.unstable_mockModule("../services/pageLoadQueue.js", () => ({
    enqueuePageLoads: mockEnqueuePageLoads,
  }));
}

export function resetMockClient(): void {
  for (const model of Object.values(mockPrismaClient)) {
    for (const method of Object.values(model)) {
      method.mockReset();
    }
  }
  mockEnqueuePageLoads.mockReset();
}
