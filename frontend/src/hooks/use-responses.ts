import { useQuery } from "@tanstack/react-query"
import {
  getAmount,
  type GroupedCount,
  type GetResponseAmountOptions,
} from "@/services/response-service"

const responseKeys = {
  amount: ({ statusCode, group }: GetResponseAmountOptions) =>
    ["responses", "amount", statusCode ?? "all", group ?? false] as const,
}

export function useResponseAmount(
  options: GetResponseAmountOptions & { group: true }
): {
  amount: GroupedCount[]
  loading: boolean
  error: string | null
}
export function useResponseAmount(
  options?: GetResponseAmountOptions & { group?: false | undefined }
): {
  amount: GroupedCount
  loading: boolean
  error: string | null
}
export function useResponseAmount(options: GetResponseAmountOptions): {
  amount: GroupedCount | GroupedCount[]
  loading: boolean
  error: string | null
}
export function useResponseAmount(options: GetResponseAmountOptions = {}) {
  const defaultAmount: GroupedCount | GroupedCount[] = options.group
    ? []
    : { count: 0 }

  const {
    data: amount = defaultAmount,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: responseKeys.amount(options),
    queryFn: () => getAmount(options),
  })

  return {
    amount,
    loading,
    error: error ? (error as Error).message : null,
  }
}
