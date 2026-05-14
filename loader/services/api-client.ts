import axios from "axios";
import getBaseUrl from "../lib/getBaseUrl.js";
import getToken from "../lib/getToken.js";

function getRequiredBaseUrl(): string {
  const baseUrl = getBaseUrl();

  if (!baseUrl) {
    throw new Error("HELIOS_URL is not set");
  }

  return baseUrl;
}

const apiClient = axios.create();

apiClient.interceptors.request.use((config) => {
  config.baseURL = `${getRequiredBaseUrl()}/api`;

  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;
