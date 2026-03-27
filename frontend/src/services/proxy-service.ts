import type { Proxy } from "@/types"
import apiClient from "./api-client"

export async function fetchProxies(): Promise<Proxy[]> {
  const response = await apiClient.get("/proxies");
  return response.data;
}
