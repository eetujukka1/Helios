import dotenv from "dotenv";
import createWorker from "./createWorker.js";
import { envService } from "./lib/envService.js";
import setToken from "./lib/setToken.js";
import getAuth from "./services/auth.js";
const env = envService.get("NODE_ENV");

dotenv.config({
  path: env ? `../.env.${env}` : "../.env",
});

setToken(await getAuth());

async function main(): Promise<void> {
  createWorker();
}

void main();
