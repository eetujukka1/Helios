import { Spinner } from "@/components/ui/spinner"

import Protected from "@/layouts/protected"
import AppHeader from "@/components/app-header"
import { DataCard } from "@/components/ui/data-card"

import { useProxies } from "@/hooks/use-proxies"
import { useSites } from "@/hooks/use-sites"

import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const { sites, loading: sitesLoading, getSites } = useSites()
  const { proxies, loading: proxiesLoading, getProxies } = useProxies()
  const navigate = useNavigate()

  const refresh = () => {
    getSites();
    getProxies();
  }

  return (
    <Protected>
      <AppHeader title="Dashboard" >
        <Button variant="outline" onClick={() => refresh()}>Refresh</Button>
      </AppHeader>
      {sitesLoading || proxiesLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <DataCard value={proxies.length} title="Proxies">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/proxies")}
            >
              View
            </Button>
          </DataCard>
          <DataCard value={sites.length} title="Sites">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/sites")}
            >
              View
            </Button>
          </DataCard>
        </div>
      )}
    </Protected>
  )
}
