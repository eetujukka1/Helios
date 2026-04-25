import { Router } from "express";
import {
  getAll,
  getOne,
  add,
  remove,
  addPages,
} from "../controllers/targetController.js";
import { validateId } from "../middlewares/validateId.js";
import { createRequireRole } from "../middlewares/requireRole.js";
import { ActorTypeEnum } from "../schemas/auth.js";

const requireUser = createRequireRole(ActorTypeEnum.User);
const requireWorker = createRequireRole(ActorTypeEnum.Worker);

const router = Router();

router.get("/", requireUser, getAll);

router.get("/:id", requireUser, validateId, getOne);

router.post("/", requireUser, add);

router.delete("/:id", requireUser, validateId, remove);

router.post("/:id/pages", requireWorker, validateId, addPages);

export default router;
