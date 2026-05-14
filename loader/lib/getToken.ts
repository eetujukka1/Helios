import { envService } from "./envService.js";

function getToken(): string | undefined {
  return envService.get("WORKER_AUTH_TOKEN");
}

export default getToken;
