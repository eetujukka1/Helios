import Protected from "@/layouts/protected"
import { AddProxyModal } from "@/modals/add-proxy"
import ProxyTable from "@/components/proxy-table"
import AppHeader from "@/components/app-header"

import { Button } from "@/components/ui/button"
import { useProxies } from "@/hooks/use-proxies"

import { useTranslation } from "react-i18next"

export default function Proxies() {
  const { getProxies } = useProxies()
  const { t } = useTranslation()

  return (
    <Protected>
      <AppHeader title={t("proxies.page.title")}>
        <Button onClick={getProxies} variant="outline">
          {t("common.actions.refresh")}
        </Button>
        <AddProxyModal />
      </AppHeader>
      <ProxyTable />
    </Protected>
  )
}
