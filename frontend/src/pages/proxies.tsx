import Protected from "@/layouts/protected"
import { AddProxyModal } from "@/modals/add-proxy"
import { AddProxyFileModal } from "@/modals/add-proxy-file"
import ProxyTable from "@/components/proxy-table"
import AppHeader from "@/components/app-header"

import { Button } from "@/components/ui/button"
import { useProxies } from "@/hooks/use-proxies"

export default function Proxies() {
  const { getProxies } = useProxies()

  return (
    <Protected>
      <AppHeader title="Proxies">
        <Button onClick={getProxies} variant="outline">
          Refresh
        </Button>
        <AddProxyModal />
        <AddProxyFileModal />
      </AppHeader>
      <ProxyTable />
    </Protected>
  )
}
