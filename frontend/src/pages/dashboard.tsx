import Protected from "@/layouts/protected"
import AppHeader from "@/components/app-header"
import { DataCard, DataCardSkeleton } from "@/components/data-card"
import { DataPieChart, DataPieChartSkeleton } from "@/components/data-pie-chart"

import { Button } from "@/components/ui/button"
import { useQueryClient } from "@tanstack/react-query"

import { useTranslation } from "react-i18next"
import { usePageAmount } from "@/hooks/use-pages"
import { useProxyAmount } from "@/hooks/use-proxies"
import { useTargetAmount } from "@/hooks/use-targets"
import { useResponseAmount } from "@/hooks/use-responses"

export default function Dashboard() {
  const queryClient = useQueryClient()
  const { amount: targetAmount, loading: targetsLoading } = useTargetAmount()
  const { amount: proxyAmount, loading: proxiesLoading } = useProxyAmount()
  const { amount: pageAmount, loading: pagesLoading } = usePageAmount()
  const { amount: responseAmount, loading: responsesLoading } =
    useResponseAmount({
      group: true,
    })

  const { t } = useTranslation()

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["targets"] })
    queryClient.invalidateQueries({ queryKey: ["proxies"] })
    queryClient.invalidateQueries({ queryKey: ["pages"] })
    queryClient.invalidateQueries({ queryKey: ["responses"] })
  }

  const responseChartData = responseAmount.map((item) => ({
    label: String(item.statusCode ?? "unknown"),
    value: item.count,
  }))

  return (
    <Protected>
      <AppHeader title={t("dashboard.title")}>
        <Button variant="outline" onClick={() => refresh()}>
          {t("common.actions.refresh")}
        </Button>
      </AppHeader>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
        {proxiesLoading ? (
          <DataCardSkeleton />
        ) : (
          <DataCard
            value={proxyAmount}
            title={t("dashboard.cards.proxies.title")}
          />
        )}
        {targetsLoading ? (
          <DataCardSkeleton />
        ) : (
          <DataCard
            value={targetAmount}
            title={t("dashboard.cards.targets.title")}
          />
        )}
        {pagesLoading ? (
          <DataCardSkeleton />
        ) : (
          <DataCard
            value={pageAmount}
            title={t("dashboard.cards.pages.title")}
          />
        )}
        {responsesLoading ? (
          <DataCardSkeleton />
        ) : (
          <DataCard
            value={
              responseChartData.find((item) => item.label === "200")?.value ?? 0
            }
            title={t("dashboard.cards.successfulResponses.title")}
          />
        )}
        {responsesLoading ? (
          <DataPieChartSkeleton />
        ) : (
          <DataPieChart
            data={responseChartData}
            title={t("dashboard.cards.responses.title")}
            totalLabel={t("dashboard.cards.responses.totalLabel")}
          />
        )}
      </div>
    </Protected>
  )
}
