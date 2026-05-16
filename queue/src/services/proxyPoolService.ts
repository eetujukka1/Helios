import { createAddOperation, createGetOperation, createDeleteOperation, createGetRandomOperation } from "../operations.js";
import { ResourceTypeEnum } from "../config/resourcePools.js";
import type { Proxy } from "@helios/shared";

export const add = createAddOperation<Proxy>(ResourceTypeEnum.Proxy);

export const get = createGetOperation<Proxy>(ResourceTypeEnum.Proxy);

export const getRandom = createGetRandomOperation<Proxy>(ResourceTypeEnum.Proxy);

export const remove = createDeleteOperation(ResourceTypeEnum.Proxy);
