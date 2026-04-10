import { Card, CardContent, CardHeader } from "./ui/card"
import { useNavigate } from "react-router-dom"

type Props = {
  value: number
  title: string
  href: string
}

export function DataCard({ value, title, href }: Props) {
  const navigate = useNavigate()

  return (
    <Card
      role="link"
      tabIndex={0}
      className="cursor-pointer transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      onClick={() => navigate(href)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          navigate(href)
        }
      }}
    >
      <CardHeader className="flex-column flex">{title}</CardHeader>
      <CardContent>
        <h1 className="text-center text-4xl">{value}</h1>
      </CardContent>
    </Card>
  )
}
