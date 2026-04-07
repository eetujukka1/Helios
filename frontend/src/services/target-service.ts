import type { Target, TargetCreate } from "@helios/shared"
import apiClient from "./api-client"

export async function get(): Promise<Target[]> {
  const response = await apiClient.get("/targets")
  return response.data
}

export async function add(targets: TargetCreate[]): Promise<Target[]> {
  const response = await apiClient.post("/targets", {
    targets: targets,
  })
  return response.data
}

export async function remove(id: number | string): Promise<Target> {
  const response = await apiClient.delete(`/targets/${id}`)
  return response.data
}
