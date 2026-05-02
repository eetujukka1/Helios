import { Router } from "express";
import {
  getAll,
  getOne,
  getResponses,
  addResponses,
} from "../controllers/pageController.js";
import { validateId } from "../middlewares/validateId.js";
import { createRequireRole } from "../middlewares/requireRole.js";
import { ActorTypeEnum } from "../schemas/auth.js";

const router = Router();

const requireUser = createRequireRole(ActorTypeEnum.User);
const requireWorker = createRequireRole(ActorTypeEnum.Worker);

router.get("/", requireUser, getAll);

router.get("/:id", requireUser, validateId, getOne);

router.get("/:id/responses", requireWorker, validateId, getResponses);

router.post("/:id/responses", requireWorker, validateId, addResponses);

export default router;
