"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type ChartPoint = {
  day: string
  content: number
  inquiries: number
}

type StatsChartProps = {
  data?: ChartPoint[]
}

const defaultData: ChartPoint[] = [
  { day: "Mon", content: 2, inquiries: 1 },
  { day: "Tue", content: 1, inquiries: 2 },
  { day: "Wed", content: 4, inquiries: 3 },
  { day: "Thu", content: 3, inquiries: 1 },
  { day: "Fri", content: 5, inquiries: 2 },
  { day: "Sat", content: 2, inquiries: 1 },
  { day: "Sun", content: 4, inquiries: 2 },
]

const chartConfig = {
  content: {
    label: "Content Updates",
    color: "var(--chart-1)",
  },
  inquiries: {
    label: "Inquiries",
    color: "var(--chart-2)",
  },
}

export function StatsChart({ data }: StatsChartProps) {
  const chartData = data?.length ? data : defaultData
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="fillVisitors" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
          <XAxis 
            dataKey="day" 
            tickLine={false} 
            axisLine={false}
            tickMargin={8}
            className="text-xs fill-muted-foreground"
          />
          <YAxis 
            tickLine={false} 
            axisLine={false}
            tickMargin={8}
            className="text-xs fill-muted-foreground"
          />
          <ChartTooltip 
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Area
            type="monotone"
            dataKey="inquiries"
            stroke="var(--chart-2)"
            strokeWidth={2}
            fill="url(#fillVisitors)"
          />
          <Area
            type="monotone"
            dataKey="content"
            stroke="var(--chart-1)"
            strokeWidth={2}
            fill="url(#fillViews)"
          />
        </AreaChart>
    </ChartContainer>
  )
}
