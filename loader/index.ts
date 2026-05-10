import dotenv from "dotenv";
import createWorker from "./lib/createWorker.js";
import getAuth from "./lib/getAuth.js";
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
