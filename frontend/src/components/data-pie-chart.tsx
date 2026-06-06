import { Cell, Label, Pie, PieChart } from "recharts"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { formatDisplayNumber } from "@/lib/utils/formatDisplayNumber"

export type DataPieChartItem = {
  label: string
  value: number
}

type Props = {
  data: DataPieChartItem[]
  title: string
  footer?: string
  totalLabel?: string
}

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
  "var(--chart-9)",
  "var(--chart-10)",
]

export function DataPieChart({ data, title, footer, totalLabel }: Props) {
  const chartConfig = data.reduce<ChartConfig>((config, item, index) => {
    config[item.label] = {
      label: item.label,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }
    return config
  }, {})

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">{title}</CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          className="mx-auto aspect-square max-h-[250px]"
          config={chartConfig}
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius={60}
              strokeWidth={5}
            >
              {data.map((item, index) => (
                <Cell
                  key={`${item.label}-${index}`}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {formatDisplayNumber(total)}
                        </tspan>
                        {totalLabel ? (
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            {totalLabel}
                          </tspan>
                        ) : null}
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      {footer ? (
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="leading-none text-muted-foreground">{footer}</div>
        </CardFooter>
      ) : null}
    </Card>
  )
}
