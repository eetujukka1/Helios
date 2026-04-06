import type { Proxy, ProxyInput } from "@/types"
import apiClient from "./api-client"

export async function get(): Promise<Proxy[]> {
  const response = await apiClient.get("/proxies")
  return response.data
}

export async function add(proxies: ProxyInput[]): Promise<Proxy[]> {
  const response = await apiClient.post("/proxies", {
    proxies: proxies,
  })
  return response.data
}

export async function remove(id: number | string): Promise<Proxy[]> {
  const response = await apiClient.delete(`/proxies/${id}`)
  return response.data
}
