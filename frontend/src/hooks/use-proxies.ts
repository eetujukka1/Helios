import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { ProxyInput } from "@/types"
import { get, add, remove } from "@/services/proxy-service"
import { toast } from "sonner"

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

  const getProxies = () => queryClient.invalidateQueries({ queryKey: ["proxies"] })

  const { mutateAsync: addProxies } = useMutation({
    mutationFn: (newProxies: ProxyInput[]) => add(newProxies),
    onSuccess: () => getProxies(),
    onError: (error: Error) => toast.error("Failed to add proxies", {
      description: error.message,
      position: "top-center"
    })
  })

  const { mutateAsync: removeProxy } = useMutation({
    mutationFn: (id: number | string) => remove(id),
    onSuccess: () => getProxies(),
    onError: (error: Error) => toast.error("Failed to remove proxy", {
      description: error.message,
      position: "top-center"
    })  
  })

  return {
    proxies,
    loading,
    error: error ? (error as Error).message : null,
    getProxies,
    addProxies,
    removeProxy
  }
}
