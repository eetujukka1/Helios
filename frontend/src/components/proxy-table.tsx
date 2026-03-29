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

export default function ProxyTable() {
  const { proxies, loading, error } = useProxies()
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
          <AddProxyModal />
        </EmptyHeader>
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
            <TableHead className="text-right">Actions</TableHead>
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
                  <Badge variant="destructive">Disabled</Badge>
                ) : (
                  <Badge variant="success">Enabled</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <RemoveProxyModal proxy={p}/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
}
