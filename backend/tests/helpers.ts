export const SECRET = "testsecret";

export function setupEnv() {
  process.env.JWT_SECRET = SECRET;
  process.env.DEMO_USER_USERNAME = "admin";
  process.env.DEMO_USER_PASSWORD = "password123";
  process.env.DEMO_WORKER_ID = "worker";
  process.env.DEMO_WORKER_SECRET = "secretkey";
}
