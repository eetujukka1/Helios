import type { Proxy, ProxyCreate, ProxyUpdate } from "@helios/shared"
import apiClient from "./api-client"

export async function get(): Promise<Proxy[]> {
  const response = await apiClient.get("/proxies")
  return response.data
}

export async function add(proxies: ProxyCreate[]): Promise<Proxy[]> {
  const response = await apiClient.post("/proxies", {
    proxies: proxies,
  })
  return response.data
}

export async function remove(id: number | string): Promise<Proxy[]> {
  const response = await apiClient.delete(`/proxies/${id}`)
  return response.data
}

export async function update(
  id: number | string,
  proxy: ProxyUpdate
): Promise<Proxy> {
  const response = await apiClient.patch(`/proxies/${id}`, proxy)
  return response.data
}
