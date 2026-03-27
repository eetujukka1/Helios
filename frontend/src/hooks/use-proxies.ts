import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { ProxyInput } from "@/types"
import { fetchProxies, addProxies as add } from "@/services/proxy-service"

export function useProxies() {
  const queryClient = useQueryClient()

  const { data: proxies = [], isLoading: loading, error } = useQuery({
    queryKey: ["proxies"],
    queryFn: fetchProxies,
  })

  const { mutateAsync: addProxies } = useMutation({
    mutationFn: (newProxies: ProxyInput[]) => add(newProxies),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["proxies"] }),
  })

  const getProxies = () => queryClient.invalidateQueries({ queryKey: ["proxies"] })

  return {
    proxies,
    loading,
    error: error ? (error as Error).message : null,
    getProxies,
    addProxies,
  }
}
