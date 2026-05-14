import dotenv from "dotenv";
import app from "./app.js";
import { envService } from "./services/envService.js";
import { scheduleMissedPages } from "./utils/scheduleMissedPages.js";

const env = envService.get("NODE_ENV");

dotenv.config({
  path: env ? `../.env.${env}` : "../.env",
});

scheduleMissedPages();

const PORT = envService.get("PORT") || 3000;

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
