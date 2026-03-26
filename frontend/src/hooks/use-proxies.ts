import { useState, useEffect } from "react"
import type { Proxy } from "@/types"
import { fetchProxies } from "@/services/proxy-service"

export function useProxies() {
  const [proxies, setProxies] = useState<Proxy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getProxies = async () => {
    setLoading(true)
    setError(null)
    try {
      setProxies(await fetchProxies())
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getProxies()
  }, [])

  return { proxies, loading, error, getProxies }
}
