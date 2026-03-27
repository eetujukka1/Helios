import type { Site, SiteInput } from "@/types"
import apiClient from "./api-client"

export async function fetchSites(): Promise<Site[]> {
  const response = await apiClient.get("/targets");
  return response.data;
}

export async function addSites(sites: SiteInput[]): Promise<Site[]> {
  const response = await apiClient.post("/targets", {
    targets: sites
  });
  return response.data;
}
