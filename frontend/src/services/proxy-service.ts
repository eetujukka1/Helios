import type { Proxy } from "@/types"

const SIMULATE_DELAY = 800

const SIMULATE_ERROR = false

const MOCK_PROXIES: Proxy[] = [
  {
    id: 1,
    host: "example.com",
    port: 5124,
    username: "testi",
    enabled: true,
  },
  {
    id: 2,
    host: "example.com",
    port: 5124,
    username: "testi",
    enabled: true,
  },
  {
    id: 3,
    host: "example.com",
    port: 5124,
    username: "testi",
    enabled: false,
  },
]

export async function fetchProxies(): Promise<Proxy[]> {
  if (SIMULATE_ERROR) {
    throw new Error("Failed to fetch proxies")
  }
  await new Promise((resolve) => setTimeout(resolve, SIMULATE_DELAY))
  return MOCK_PROXIES
}
