function getBaseUrl(): string | undefined {
  return process.env.HELIOS_URL;
}

export default getBaseUrl;
