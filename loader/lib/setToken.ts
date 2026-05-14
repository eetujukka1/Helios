import { envService } from "./envService.js";

function setToken(token: string): void {
  envService.set("WORKER_AUTH_TOKEN", token);
}

export default setToken;
