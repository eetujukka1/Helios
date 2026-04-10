import { Link } from "react-router-dom"

import { Card, CardContent, CardHeader } from "./ui/card"

type Props = {
  value: number
  title: string
  to: string
}

export function DataCard({ value, title, to }: Props) {
  return (
    <Link to={to} className="block focus-visible:outline-none">
      <Card className="transition hover:ring-foreground/30 focus-visible:ring-2 focus-visible:ring-primary">
        <CardHeader className="flex-column flex">{title}</CardHeader>
        <CardContent>
          <h1 className="text-center text-4xl">{value}</h1>
        </CardContent>
      </Card>
    </Link>
  )
}
