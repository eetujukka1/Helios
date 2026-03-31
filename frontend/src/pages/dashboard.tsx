import { Spinner } from "@/components/ui/spinner"

import Protected from "@/layouts/protected"
import AppHeader from "@/components/app-header"
import { DataCard } from "@/components/ui/data-card"

import { useProxies } from "@/hooks/use-proxies"
import { useSites } from "@/hooks/use-sites"

export default function Dashboard() {
const { sites, loading: sitesLoading } = useSites();
const { proxies, loading: proxiesLoading } = useProxies();

  return (
    <Protected>
      <AppHeader title="Dashboard" />
      {sitesLoading || proxiesLoading 
        ? <div className="flex justify-center py-8">
            <Spinner />
        </div>
        : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <DataCard value={proxies.filter(p => p.disabled === false).length} title="Proxies enabled" />
          <DataCard value={proxies.filter(p => p.disabled === true).length} title="Proxies disabled" />
          <DataCard value={sites.filter(s => s.disabled === false).length} title="Sites enabled" />
          <DataCard value={sites.filter(s => s.disabled === true).length} title="Sites disabled" />
        </div>
      }
    </Protected>   
  )
}
