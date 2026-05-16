import {
  createAddOperation,
  createBulkAddOperation,
  createGetOperation,
  createDeleteOperation,
} from "../operations.js";
import { ResourceTypeEnum } from "../config/resourcePools.js";
import type { Target } from "@helios/shared";

export const add = createAddOperation<Target>(ResourceTypeEnum.Target);

export const bulkAdd = createBulkAddOperation<Target>(ResourceTypeEnum.Target);

export const get = createGetOperation<Target>(ResourceTypeEnum.Target);

export const remove = createDeleteOperation(ResourceTypeEnum.Target);
