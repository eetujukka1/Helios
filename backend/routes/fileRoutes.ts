import { Router } from 'express';
import {
  getAll,
  getOne,
  add,
  remove,
} from "../controllers/fileController.js";
import { validateId } from "../middlewares/validateId.js";

const router = Router();

router.get("/", getAll);

router.get("/:id", validateId, getOne);

router.post("/", add);

router.delete("/:id", validateId, remove);

export default router;