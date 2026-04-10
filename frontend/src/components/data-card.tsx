import { Link } from "react-router-dom"

import { Card, CardContent, CardHeader } from "./ui/card"

type Props = {
  value: number
  title: string
  to: string
}

export function DataCard({ value, title, to }: Props) {
  return (
    <Link to={to} className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
      <Card className="h-full cursor-pointer transition-colors hover:bg-accent/20">
        <CardHeader className="flex-column flex">{title}</CardHeader>
        <CardContent>
          <h1 className="text-center text-4xl">{value}</h1>
        </CardContent>
      </Card>
    </Link>
  )
}
