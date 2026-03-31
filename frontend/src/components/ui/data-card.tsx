import { Card, CardContent, CardFooter, CardHeader } from "./card";
import { Button } from "./button";

type Props = {
  value: number,
  title: string
}

export function DataCard({value, title}: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-column">
        {title}
      </CardHeader>
      <CardContent>
        <h1 className="text-4xl text-center">
          {value}
        </h1>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">View</Button>
      </CardFooter>
    </Card>
  )
}