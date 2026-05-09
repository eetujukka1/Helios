import axios from "axios";
import getBaseUrl from "./getBaseUrl.js";

type WorkerAuthResponse = {
  token: string;
};

async function getAuth(): Promise<string> {
  const baseUrl = getBaseUrl();
  const workerId = process.env.DEMO_WORKER_ID;
  const secret = process.env.DEMO_WORKER_SECRET;

  if (!baseUrl) {
    throw new Error("HELIOS_URL is not set");
  }

  if (!workerId) {
    throw new Error("DEMO_WORKER_ID is not set");
  }

  if (!secret) {
    throw new Error("DEMO_WORKER_SECRET is not set");
  }

  const { data } = await axios.post<WorkerAuthResponse>(
    `${baseUrl}/api/workers/auth/login`,
    {
      workerId,
      secret,
    },
  );

  return data.token;
}
export default getAuth;