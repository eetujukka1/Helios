import type { Site, SiteInput } from "@/types"
import apiClient from "./api-client"

export async function get(): Promise<Site[]> {
  const response = await apiClient.get("/targets")
  return response.data
}

export async function add(sites: SiteInput[]): Promise<Site[]> {
  const response = await apiClient.post("/targets", {
    targets: sites,
  })
  return response.data
}

export async function remove(id: number | string): Promise<Site> {
  const response = await apiClient.delete(`/targets/${id}`);
  return response.data;
}