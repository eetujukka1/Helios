import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  HoverCardWrapper,
  HoverCardContentWrapper,
  HoverCardTriggerWrapper,
} from "@/components/reusables/hover-card"

import { Badge } from "@/components/ui/badge"

import { NetworkIcon, InfoIcon, CircleQuestionMark } from "lucide-react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

import { Skeleton } from "@/components/ui/skeleton"
import { useProxies } from "@/hooks/use-proxies"

import { RemoveProxyModal } from "@/modals/remove-proxy"
import { AddProxyModal } from "@/modals/add-proxy"
import { UpdateProxyModal } from "@/modals/update-proxy"

import { useTranslation } from "react-i18next"
import EnableDisableButton from "@/components/enable-disable-button"

function ProxyTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Skeleton className="h-4 w-20" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-12" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-24" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-16" />
          </TableHead>
          <TableHead className="text-right">
            <div className="flex justify-end">
              <Skeleton className="h-4 w-16" />
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-5 w-40" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-12" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-28" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-16 rounded-4xl" />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Skeleton className="h-6 w-6 rounded-lg" />
                <Skeleton className="h-6 w-6 rounded-lg" />
                <Skeleton className="h-6 w-6 rounded-lg" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function ProxyTable() {
  const { proxies, loading, error, enableProxy, disableProxy } = useProxies()
  const { t } = useTranslation()

  if (loading) {
    return <ProxyTableSkeleton />
  }

  if (error) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <InfoIcon />
          </EmptyMedia>
          <EmptyTitle>{t("common.states.error")}</EmptyTitle>
          <EmptyDescription>{error}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (!proxies || proxies.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <NetworkIcon />
          </EmptyMedia>
          <div className={"flex items-center gap-2"}>
            <EmptyTitle>{t("proxies.empty.title")}</EmptyTitle>
            <HoverCardWrapper>
              <HoverCardTriggerWrapper>
                <CircleQuestionMark className="size-4" />
              </HoverCardTriggerWrapper>
              <HoverCardContentWrapper>
                {t("proxies.empty.hovercard", {
                  name: t("app.name"),
                })}
              </HoverCardContentWrapper>
            </HoverCardWrapper>
          </div>
          <EmptyDescription>{t("proxies.empty.description")}</EmptyDescription>
          <AddProxyModal />
        </EmptyHeader>
      </Empty>
    )
  } else {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("proxies.table.columns.host")}</TableHead>
            <TableHead>{t("proxies.table.columns.port")}</TableHead>
            <TableHead>{t("proxies.table.columns.username")}</TableHead>
            <TableHead>{t("proxies.table.columns.status")}</TableHead>
            <TableHead className="text-right">
              {t("proxies.table.columns.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {proxies.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.host}</TableCell>
              <TableCell>{p.port}</TableCell>
              <TableCell>{p.username}</TableCell>
              <TableCell>
                {p.disabled ? (
                  <Badge variant="destructive">
                    {t("common.states.disabled")}
                  </Badge>
                ) : (
                  <Badge variant="success">{t("common.states.enabled")}</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <EnableDisableButton
                    disabled={p.disabled}
                    onClick={
                      p.disabled
                        ? () => enableProxy(p.id)
                        : () => disableProxy(p.id)
                    }
                  />
                  <UpdateProxyModal proxy={p} />
                  <RemoveProxyModal proxy={p} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
}
