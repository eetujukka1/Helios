import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { TargetCreate } from "@helios/shared"
import {
  get,
  getAmount,
  add,
  remove,
  enable,
  disable,
} from "@/services/target-service"

const targetKeys = {
  all: ["targets"] as const,
  amount: ["targets", "amount"] as const,
}

export function useTargets() {
  const queryClient = useQueryClient()

  const {
    data: targets = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: targetKeys.all,
    queryFn: get,
  })

  const getTargets = () =>
    queryClient.invalidateQueries({ queryKey: targetKeys.all })

  const { mutateAsync: addTargets } = useMutation({
    mutationFn: (newTargets: TargetCreate[]) => add(newTargets),
    onSuccess: () => getTargets(),
  })

  const { mutateAsync: removeTarget } = useMutation({
    mutationFn: (id: number | string) => remove(id),
    onSuccess: () => getTargets(),
  })

  const { mutateAsync: disableTarget } = useMutation({
    mutationFn: (id: number | string) => disable(id),
    onSuccess: () => getTargets(),
  })

  const { mutateAsync: enableTarget } = useMutation({
    mutationFn: (id: number | string) => enable(id),
    onSuccess: () => getTargets(),
  })

  return {
    targets,
    loading,
    error: error ? (error as Error).message : null,
    getTargets,
    addTargets,
    removeTarget,
    disableTarget,
    enableTarget,
  }
}

export function useTargetAmount() {
  const {
    data: amount = 0,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: targetKeys.amount,
    queryFn: getAmount,
  })

  return {
    amount,
    loading,
    error: error ? (error as Error).message : null,
  }
}
