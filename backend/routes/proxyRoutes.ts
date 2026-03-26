import { Router } from "express";
import { getAll, getOne, remove } from "../controllers/proxyController.js";
import { validateId } from "../middlewares/validateId.js";

const router = Router();

router.get("/", getAll);

router.get("/:id", validateId, getOne);

router.delete("/:id", validateId, remove);

export default router;
