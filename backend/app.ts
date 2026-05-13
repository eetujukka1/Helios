import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import healthRoute from "./routes/healthRoute.js";
import authRoutes from "./routes/authRoutes.js";
import workerAuthRoutes from "./routes/workerAuthRoutes.js";
import proxyRoutes from "./routes/proxyRoutes.js";
import targetRoutes from "./routes/targetRoutes.js";
import pageRoutes from "./routes/pageRouter.js";
import { authenticateToken } from "./middlewares/auth.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { createRequireRole } from "./middlewares/requireRole.js";
import { ActorTypeEnum } from "./schemas/auth.js";

const app = express();

const requireUser = createRequireRole(ActorTypeEnum.User);

app.use(cors());
app.use(bodyParser.json());

app.use("/api/health", healthRoute);
app.use("/api/auth", authRoutes);
app.use("/api/proxies", authenticateToken, requireUser, proxyRoutes);
app.use("/api/pages", authenticateToken, pageRoutes);
app.use("/api/targets", authenticateToken, targetRoutes);
app.use("/api/workers/auth", workerAuthRoutes);

app.use(errorHandler);

export default app;
