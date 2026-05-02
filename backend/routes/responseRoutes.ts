import { Router } from "express";
import { getAll, getOne } from "../controllers/responseController.js";
import { validateId } from "../middlewares/validateId.js";

const router = Router();

router.get("/", getAll);

router.get("/:id", validateId, getOne);

export default router;
