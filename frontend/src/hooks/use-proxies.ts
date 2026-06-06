import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { ProxyCreate, ProxyUpdate } from "@helios/shared"
import {
  get,
  getAmount,
  add,
  remove,
  update,
  enable,
  disable,
} from "@/services/proxy-service"
import { toast } from "sonner"
import i18n from "@/i18n"

const proxyKeys = {
  all: ["proxies"] as const,
  amount: ["proxies", "amount"] as const,
}

export function useProxies() {
  const queryClient = useQueryClient()

  const {
    data: proxies = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: proxyKeys.all,
    queryFn: get,
  })

  const getProxies = () =>
    queryClient.invalidateQueries({ queryKey: proxyKeys.all })

  const { mutateAsync: addProxies } = useMutation({
    mutationFn: (newProxies: ProxyCreate[]) => add(newProxies),
    onSuccess: () => getProxies(),
  })

  const { mutateAsync: removeProxy } = useMutation({
    mutationFn: (id: number | string) => remove(id),
    onSuccess: () => getProxies(),
  })

  const { mutateAsync: disableProxy } = useMutation({
    mutationFn: (id: number | string) => disable(id),
    onSuccess: () => getProxies(),
  })

  const { mutateAsync: enableProxy } = useMutation({
    mutationFn: (id: number | string) => enable(id),
    onSuccess: () => getProxies(),
  })

  const { mutateAsync: updateProxy } = useMutation({
    mutationFn: ({ id, proxy }: { id: number | string; proxy: ProxyUpdate }) =>
      update(id, proxy),
    onSuccess: () => getProxies(),
    onError: (error: Error) =>
      toast.error(i18n.t("toasts.proxyUpdateFailed.title"), {
        description: error.message,
        position: "top-center",
      }),
  })

  return {
    proxies,
    loading,
    error: error ? (error as Error).message : null,
    getProxies,
    addProxies,
    removeProxy,
    updateProxy,
    enableProxy,
    disableProxy,
  }
}

export function useProxyAmount() {
  const {
    data: amount = 0,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: proxyKeys.amount,
    queryFn: getAmount,
  })

  return {
    amount,
    loading,
    error: error ? (error as Error).message : null,
  }
}
