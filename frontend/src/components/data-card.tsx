import { Link } from "react-router-dom"

import { Card, CardContent, CardHeader } from "./ui/card"

type Props = {
  value: number
  title: string
  to: string
}

export function DataCard({ value, title, to }: Props) {
  return (
    <Link className="group block focus-visible:outline-none" to={to}>
      <Card className="transition-colors hover:bg-muted/50 group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2">
        <CardHeader className="flex-column flex">{title}</CardHeader>
        <CardContent>
          <h1 className="text-center text-4xl">{value}</h1>
        </CardContent>
      </Card>
    </Link>
  )
}
