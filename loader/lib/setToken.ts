function setToken(token: string): void {
  process.env.WORKER_AUTH_TOKEN = token;
}

export default setToken;
