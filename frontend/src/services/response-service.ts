import apiClient from "./api-client"

export type GetResponseAmountOptions = {
  statusCode?: number
  group?: boolean
}

export type GroupedCount = {
  count: number
  statusCode?: number
}

export function getAmount(
  options: GetResponseAmountOptions & { group: true }
): Promise<GroupedCount[]>
export function getAmount(
  options?: GetResponseAmountOptions & { group?: false | undefined }
): Promise<GroupedCount>
export function getAmount(
  options: GetResponseAmountOptions
): Promise<GroupedCount | GroupedCount[]>
export async function getAmount(
  options: GetResponseAmountOptions = {}
): Promise<GroupedCount | GroupedCount[]> {
  const { statusCode, group } = options

  const response = await apiClient.get("/responses/amount", {
    params: {
      ...(typeof statusCode === "number" ? { statusCode } : {}),
      ...(typeof group === "boolean" ? { group } : {}),
    },
  })
  return response.data
}
