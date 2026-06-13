import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"

import { MonitorIcon, InfoIcon, CircleQuestionMark } from "lucide-react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

import { Skeleton } from "@/components/ui/skeleton"
import { useTargets } from "@/hooks/use-targets"
import { AddTargetModal } from "@/modals/add-target"
import { RemoveTargetModal } from "@/modals/remove-target"

import { useTranslation } from "react-i18next"
import EnableDisableButton from "./enable-disable-button"
import {
  HoverCardContentWrapper,
  HoverCardTriggerWrapper,
  HoverCardWrapper,
} from "@/components/reusables/hover-card.tsx"

function TargetTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
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
              <Skeleton className="h-5 w-48" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-16 rounded-4xl" />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
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

export default function TargetTable() {
  const { targets, loading, error, enableTarget, disableTarget } = useTargets()
  const { t } = useTranslation()

  if (loading) {
    return <TargetTableSkeleton />
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

  if (!targets || targets.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <MonitorIcon />
          </EmptyMedia>
          <div className={"flex items-center gap-2"}>
            <EmptyTitle>{t("targets.empty.title")}</EmptyTitle>
            <HoverCardWrapper>
              <HoverCardTriggerWrapper>
                <CircleQuestionMark className="size-4" />
              </HoverCardTriggerWrapper>
              <HoverCardContentWrapper>
                {t("targets.empty.hovercard", {
                  name: t("app.name"),
                })}
              </HoverCardContentWrapper>
            </HoverCardWrapper>
          </div>
          <EmptyDescription>{t("targets.empty.description")}</EmptyDescription>
          <AddTargetModal />
        </EmptyHeader>
      </Empty>
    )
  } else {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("targets.table.columns.domain")}</TableHead>
            <TableHead>{t("targets.table.columns.status")}</TableHead>
            <TableHead className="text-right">
              {t("targets.table.columns.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {targets.map((target) => (
            <TableRow key={target.id}>
              <TableCell>{target.domain}</TableCell>
              <TableCell>
                {target.disabled ? (
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
                    disabled={target.disabled}
                    onClick={
                      target.disabled
                        ? () => enableTarget(target.id)
                        : () => disableTarget(target.id)
                    }
                  />
                  <RemoveTargetModal target={target} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
}
