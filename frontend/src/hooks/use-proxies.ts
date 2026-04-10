import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { ProxyCreate } from "@helios/shared"
import { get, add, remove } from "@/services/proxy-service"

export function useProxies() {
  const queryClient = useQueryClient()

  const {
    data: proxies = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["proxies"],
    queryFn: get,
  })

  const getProxies = () =>
    queryClient.invalidateQueries({ queryKey: ["proxies"] })

  const { mutateAsync: addProxies } = useMutation({
    mutationFn: (newProxies: ProxyCreate[]) => add(newProxies),
    onSuccess: () => getProxies(),
  })

  const { mutateAsync: removeProxy } = useMutation({
    mutationFn: (id: number | string) => remove(id),
    onSuccess: () => getProxies(),
  })

  return {
    proxies,
    loading,
    error: error ? (error as Error).message : null,
    getProxies,
    addProxies,
    removeProxy,
  }
}
