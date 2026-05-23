import dotenv from "dotenv";
import app from "./app.js";
import { envService } from "./services/envService.js";
import { loadPages } from "./utils/loadPages.js";
import { loadProxies } from "./utils/loadProxies.js";
import { loadTargets } from "./utils/loadTargets.js";

const env = envService.get("NODE_ENV");

dotenv.config({
  path: env ? `../.env.${env}` : "../.env",
});

await loadPages();
await loadProxies();
await loadTargets();

const PORT = envService.get("PORT") || 3000;

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
