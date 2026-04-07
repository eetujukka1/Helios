import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { TargetCreate } from "@helios/shared"
import { get, add, remove } from "@/services/target-service"
import { toast } from "sonner"

export function useTargets() {
  const queryClient = useQueryClient()

  const {
    data: targets = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["targets"],
    queryFn: get,
  })

  const getTargets = () =>
    queryClient.invalidateQueries({ queryKey: ["targets"] })

  const { mutateAsync: addTargets } = useMutation({
    mutationFn: (newTargets: TargetCreate[]) => add(newTargets),
    onSuccess: () => getTargets(),
    onError: (error: Error) =>
      toast.error("Failed to add targets", {
        description: error.message,
        position: "top-center",
      }),
  })

  const { mutateAsync: removeTarget } = useMutation({
    mutationFn: (id: number | string) => remove(id),
    onSuccess: () => getTargets(),
    onError: (error: Error) =>
      toast.error("Failed to remove target", {
        description: error.message,
        position: "top-center",
      }),
  })

  return {
    targets,
    loading,
    error: error ? (error as Error).message : null,
    getTargets,
    addTargets,
    removeTarget,
  }
}
