import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"

import { MonitorIcon, InfoIcon } from "lucide-react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

import { Spinner } from "@/components/ui/spinner"
import { useTargets } from "@/hooks/use-targets"
import { AddTargetModal } from "@/modals/add-target"
import { RemoveTargetModal } from "@/modals/remove-target"

import { useTranslation } from "react-i18next"
import EnableDisableButton from "./enable-disable-button"

export default function TargetTable() {
  const { targets, loading, error, enableTarget, disableTarget } = useTargets()
  const { t } = useTranslation()

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    )
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
          <EmptyTitle>{t("targets.empty.title")}</EmptyTitle>
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
