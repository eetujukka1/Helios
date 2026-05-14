import apiClient from "./api-client.js";

type WorkerAuthResponse = {
  token: string;
};

async function getAuth(): Promise<string> {
  const workerId = process.env.DEMO_WORKER_ID;
  const secret = process.env.DEMO_WORKER_SECRET;

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
