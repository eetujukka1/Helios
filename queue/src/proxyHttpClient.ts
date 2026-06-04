import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import type { Proxy } from "@helios/shared";

export function getProxyUrl(proxy: Proxy): string {
  const url = new URL(`http://${proxy.host}:${proxy.port}`);

  if (proxy.username && proxy.password) {
    url.username = proxy.username;
    url.password = proxy.password;
  }

  return url.toString();
}

export async function proxyGet<T = unknown, R = AxiosResponse<T>>(
  proxy: Proxy,
  url: string,
  config: AxiosRequestConfig = {},
): Promise<R> {
  const proxyAgent = new HttpsProxyAgent(getProxyUrl(proxy));

  return axios.get<T, R>(url, {
    ...config,
    httpAgent: proxyAgent,
    httpsAgent: proxyAgent,
    proxy: false,
  });
}
