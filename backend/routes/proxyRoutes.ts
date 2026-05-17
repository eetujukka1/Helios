import { Router } from "express";
import {
  getAll,
  getOne,
  add,
  remove,
  update,
  enable,
  disable,
} from "../controllers/proxyController.js";
import { validateId } from "../middlewares/validateId.js";

const router = Router();

router.get("/", getAll);

router.get("/:id", validateId, getOne);

router.post("/", add);

router.patch("/:id", validateId, update);

router.delete("/:id", validateId, remove);

router.patch("/:id/disable", validateId, disable);

router.patch("/:id/enable", validateId, enable);

export default router;
