import { Card, CardContent, CardFooter, CardHeader } from "./card"

type Props = {
  value: number
  title: string
  children?: React.ReactNode
}

export function DataCard({ value, title, children }: Props) {
  return (
    <Card>
      <CardHeader className="flex-column flex">{title}</CardHeader>
      <CardContent>
        <h1 className="text-center text-4xl">{value}</h1>
      </CardContent>
      {children ? <CardFooter>{children}</CardFooter> : null}
    </Card>
  )
}
