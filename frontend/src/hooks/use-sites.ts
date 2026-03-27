import { useState, useEffect } from "react"
import type { Site } from "@/types"
import { fetchSites } from "@/services/site-service"

export function useSites() {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getSites = async () => {
    setLoading(true)
    setError(null)
    try {
      setSites(await fetchSites())
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getSites()
  }, [])

  return { sites, loading, error, getSites }
}
