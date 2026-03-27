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
import { useSites } from "@/hooks/use-sites"

export default function SiteTable() {
  const { sites, loading, error } = useSites()
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

  if (!sites || sites.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <MonitorIcon />
          </EmptyMedia>
          <EmptyTitle>No sites</EmptyTitle>
          <EmptyDescription>
            You have not added any sites yet
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  } else {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Domain</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sites.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.domain}</TableCell>
              <TableCell>
                {p.disabled ? (
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
