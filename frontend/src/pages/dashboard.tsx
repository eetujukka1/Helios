import { Spinner } from "@/components/ui/spinner"

import Protected from "@/layouts/protected"
import AppHeader from "@/components/app-header"
import { DataCard } from "@/components/data-card"

import { useProxies } from "@/hooks/use-proxies"
import { useTargets } from "@/hooks/use-targets"

import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

import { useTranslation } from "react-i18next"

export default function Dashboard() {
  const { targets, loading: targetsLoading, getTargets } = useTargets()
  const { proxies, loading: proxiesLoading, getProxies } = useProxies()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const refresh = () => {
    getTargets()
    getProxies()
  }

  return (
    <Protected>
      <AppHeader title={t("dashboard.title")}>
        <Button variant="outline" onClick={() => refresh()}>
          {t("common.actions.refresh")}
        </Button>
      </AppHeader>
      {targetsLoading || proxiesLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <DataCard
            value={proxies.length}
            title={t("dashboard.cards.proxies.title")}
          >
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/proxies")}
            >
              {t("common.actions.view")}
            </Button>
          </DataCard>
          <DataCard
            value={targets.length}
            title={t("dashboard.cards.targets.title")}
          >
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/targets")}
            >
              {t("common.actions.view")}
            </Button>
          </DataCard>
        </div>
      )}
    </Protected>
  )
}
