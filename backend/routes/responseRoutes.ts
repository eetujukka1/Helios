import { Router } from "express";
import { getAmount } from "../controllers/responseController.js";

const router = Router();

router.get("/amount", getAmount);

export default router;
