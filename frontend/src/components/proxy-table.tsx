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
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

import { Spinner } from "@/components/ui/spinner"
import { AddProxyModal } from "@/modals/add-proxy"
import type { Proxy } from "@/types"

type ProxyListProps = {
  proxies?: Proxy[]
  loading?: boolean
  error?: string | null
}

export default function ProxyTable({
  proxies,
  loading,
  error,
}: ProxyListProps) {
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
          <EmptyTitle>Error</EmptyTitle>
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
          <EmptyTitle>No proxies</EmptyTitle>
          <EmptyDescription>
            You have not added any proxies yet
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <AddProxyModal buttonText="Add proxies" />
        </EmptyContent>
      </Empty>
    )
  } else {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Host</TableHead>
            <TableHead>Port</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {proxies.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.host}</TableCell>
              <TableCell>{p.port}</TableCell>
              <TableCell>{p.username}</TableCell>
              <TableCell>
                {p.enabled ? (
                  <Badge variant="destructive">Disabled</Badge>
                ) : (
                  <Badge variant="success">Enabled</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
}
