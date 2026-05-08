import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"

import { NetworkIcon, InfoIcon } from "lucide-react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

import { Spinner } from "@/components/ui/spinner"
import { useProxies } from "@/hooks/use-proxies"

import { RemoveProxyModal } from "@/modals/remove-proxy"
import { AddProxyModal } from "@/modals/add-proxy"
import { UpdateProxyModal } from "@/modals/update-proxy"

import { useTranslation } from 'react-i18next';

export default function ProxyTable() {
  const { proxies, loading, error } = useProxies()
  const { t } = useTranslation();

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
          <EmptyTitle>{t('common.states.error')}</EmptyTitle>
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
          <EmptyTitle>{t('proxies.empty.title')}</EmptyTitle>
          <EmptyDescription>
            {t('proxies.empty.description')}
          </EmptyDescription>
          <AddProxyModal />
        </EmptyHeader>
      </Empty>
    )
  } else {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('proxies.table.columns.host')}</TableHead>
            <TableHead>{t('proxies.table.columns.port')}</TableHead>
            <TableHead>{t('proxies.table.columns.username')}</TableHead>
            <TableHead>{t('proxies.table.columns.status')}</TableHead>
            <TableHead className="text-right">{t('proxies.table.columns.actions')}</TableHead>
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
                  <Badge variant="destructive">{t("common.states.disabled")}</Badge>
                ) : (
                  <Badge variant="success">{t("common.states.enabled")}</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
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
