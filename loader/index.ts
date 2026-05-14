import dotenv from "dotenv";
import createWorker from "./createWorker.js";
import getAuth from "./services/auth.js";
import setToken from "./lib/setToken.js";
const env = process.env.NODE_ENV;

dotenv.config({
  path: env ? `../.env.${env}` : "../.env",
});

setToken(await getAuth());

async function main(): Promise<void> {
  createWorker();
}

void main();
