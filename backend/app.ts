import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js";
import proxyRoutes from "./routes/proxyRoutes.js";
import targetRoutes from "./routes/targetRoutes.js";
import { authenticateToken } from "./middlewares/auth.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/proxies", authenticateToken, proxyRoutes);
app.use("/api/targets", authenticateToken, targetRoutes);

app.use(errorHandler);

export default app;
