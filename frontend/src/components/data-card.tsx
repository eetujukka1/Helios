import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { formatDisplayNumber } from "@/lib/utils/formatDisplayNumber.ts"
import { Skeleton } from "@/components/ui/skeleton"

type Props = {
  value: number
  title: string
  children?: React.ReactNode
}

export function DataCard({ value, title, children }: Props) {
  return (
    <Card className="h-full">
      <CardHeader>{title}</CardHeader>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <CardContent className="flex w-full items-center justify-center">
          <h1 className="text-center text-4xl">{formatDisplayNumber(value)}</h1>
        </CardContent>
        {children && (
          <CardFooter className="flex w-full items-center justify-center">
            {children}
          </CardFooter>
        )}
      </div>
    </Card>
  )
}

export function DataCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <Skeleton className="h-5 w-28" />
      </CardHeader>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <CardContent className="flex w-full items-center justify-center">
          <Skeleton className="h-10 w-24" />
        </CardContent>
      </div>
    </Card>
  )
}
