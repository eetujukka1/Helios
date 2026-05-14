import { jest } from "@jest/globals";

import { mockPrismaClient } from "./helpers.js";

export const PrismaClient = jest.fn(() => mockPrismaClient);
