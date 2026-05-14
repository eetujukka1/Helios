import { envService } from "./envService.js";

function getBaseUrl(): string | undefined {
  return envService.get("HELIOS_URL");
}

export default getBaseUrl;
