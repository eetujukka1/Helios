import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { SiteInput } from "@/types"
import { fetchSites, addSites as add } from "@/services/site-service"

export function useSites() {
  const queryClient = useQueryClient()

  const { data: sites = [], isLoading: loading, error } = useQuery({
    queryKey: ["sites"],
    queryFn: fetchSites,
  })

  const { mutateAsync: addSites } = useMutation({
    mutationFn: (newSites: SiteInput[]) => add(newSites),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sites"] }),
  })

  const getSites = () => queryClient.invalidateQueries({ queryKey: ["sites"] })

  return {
    sites,
    loading,
    error: error ? (error as Error).message : null,
    getSites,
    addSites,
  }
}
