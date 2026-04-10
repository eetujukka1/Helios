import { Spinner } from "@/components/ui/spinner"

import Protected from "@/layouts/protected"
import AppHeader from "@/components/app-header"
import { DataCard } from "@/components/data-card"

import { useProxies } from "@/hooks/use-proxies"
import { useTargets } from "@/hooks/use-targets"

import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const { targets, loading: targetsLoading, getTargets } = useTargets()
  const { proxies, loading: proxiesLoading, getProxies } = useProxies()

  const refresh = () => {
    getTargets()
    getProxies()
  }

  return (
    <Protected>
      <AppHeader title="Dashboard">
        <Button variant="outline" onClick={() => refresh()}>
          Refresh
        </Button>
      </AppHeader>
      {targetsLoading || proxiesLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <DataCard value={proxies.length} title="Proxies" to="/proxies" />
          <DataCard value={targets.length} title="Targets" to="/targets" />
        </div>
      )}
    </Protected>
  )
}
