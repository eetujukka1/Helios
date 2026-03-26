import type { Site } from "@/types"
import apiClient from "./api-client"

export async function fetchSites(): Promise<Site[]> {
  const response = await apiClient.get("/targets");
  return response.data;
}
