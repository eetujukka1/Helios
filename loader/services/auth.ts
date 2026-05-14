import { envService } from "../lib/envService.js";
import getBaseUrl from "../lib/getBaseUrl.js";
import apiClient from "./api-client.js";

type WorkerAuthResponse = {
  token: string;
};

async function getAuth(): Promise<string> {
  const baseUrl = getBaseUrl();
  const workerId = envService.get("DEMO_WORKER_ID");
  const secret = envService.get("DEMO_WORKER_SECRET");

  if (!baseUrl) {
    throw new Error("HELIOS_URL is not set");
  }

  if (!workerId) {
    throw new Error("DEMO_WORKER_ID is not set");
  }

  if (!secret) {
    throw new Error("DEMO_WORKER_SECRET is not set");
  }

  const { data } = await apiClient.post<WorkerAuthResponse>(
    "/workers/auth/login",
    {
      workerId,
      secret,
    },
  );

  return data.token;
}
export default getAuth;
