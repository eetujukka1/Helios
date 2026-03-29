import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { SiteInput } from "@/types"
import { get,  add, remove } from "@/services/site-service"
import { toast } from "sonner"

export function useSites() {
  const queryClient = useQueryClient()

  const {
    data: sites = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["sites"],
    queryFn: get,
  })

  const getSites = () => queryClient.invalidateQueries({ queryKey: ["sites"] })

  const { mutateAsync: addSites } = useMutation({
    mutationFn: (newSites: SiteInput[]) => add(newSites),
    onSuccess: () => getSites(),
    onError: (error: Error) => toast.error("Failed to add sites", {
      description: error.message,
      position: "top-center"
    })
  })

  const { mutateAsync: removeSite } = useMutation({
    mutationFn: (id: number | string) => remove(id),
    onSuccess: () => getSites(),
    onError: (error: Error) => toast.error("Failed to remove site", {
      description: error.message,
      position: "top-center"
    })
  })

  return {
    sites,
    loading,
    error: error ? (error as Error).message : null,
    getSites,
    addSites,
    removeSite,
  }
}
