function getToken(): string | undefined {
  return process.env.WORKER_AUTH_TOKEN;
}

export default getToken;