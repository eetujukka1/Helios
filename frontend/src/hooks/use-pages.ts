import { useQuery } from "@tanstack/react-query"
import { getAmount } from "@/services/page-service"

const pageKeys = {
  amount: ["pages", "amount"] as const,
}

export function usePageAmount() {
  const {
    data: amount = 0,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: pageKeys.amount,
    queryFn: getAmount,
  })

  return {
    amount,
    loading,
    error: error ? (error as Error).message : null,
  }
}
