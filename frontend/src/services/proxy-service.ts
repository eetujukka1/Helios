import type { Proxy, ProxyInput } from "@/types"
import apiClient from "./api-client"

export async function fetchProxies(): Promise<Proxy[]> {
  const response = await apiClient.get("/proxies");
  return response.data;
}

export async function addProxies(proxies: ProxyInput[]): Promise<Proxy[]> {
  const response = await apiClient.post("/proxies", {
    proxies: proxies
  });
  return response.data;
}