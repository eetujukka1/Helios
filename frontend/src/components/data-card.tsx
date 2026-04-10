import { Link } from "react-router-dom"

import { Card, CardContent, CardHeader } from "./ui/card"

type Props = {
  value: number
  title: string
  to?: string
}

export function DataCard({ value, title, to }: Props) {
  const card = (
    <Card className={to ? "h-full cursor-pointer transition-colors hover:bg-muted/30" : "h-full"}>
      <CardHeader className="flex-column flex">{title}</CardHeader>
      <CardContent>
        <h1 className="text-center text-4xl">{value}</h1>
      </CardContent>
    </Card>
  )

  if (!to) return card

  return (
    <Link
      to={to}
      className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {card}
    </Link>
  )
}
