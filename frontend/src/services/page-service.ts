import apiClient from "./api-client"

export async function getAmount(): Promise<number> {
  const response = await apiClient.get("/pages/amount")
  return response.data.amount
}
