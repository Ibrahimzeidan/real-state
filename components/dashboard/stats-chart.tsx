"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { day: "Mon", views: 2400, visitors: 1398 },
  { day: "Tue", views: 1398, visitors: 980 },
  { day: "Wed", views: 3800, visitors: 2390 },
  { day: "Thu", views: 3908, visitors: 2480 },
  { day: "Fri", views: 4800, visitors: 3180 },
  { day: "Sat", views: 3800, visitors: 2500 },
  { day: "Sun", views: 4300, visitors: 2800 },
]

const chartConfig = {
  views: {
    label: "Page Views",
    color: "var(--chart-1)",
  },
  visitors: {
    label: "Unique Visitors",
    color: "var(--chart-2)",
  },
}

export function StatsChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
            dataKey="visitors"
            stroke="var(--chart-2)"
            strokeWidth={2}
            fill="url(#fillVisitors)"
          />
          <Area
            type="monotone"
            dataKey="views"
            stroke="var(--chart-1)"
            strokeWidth={2}
            fill="url(#fillViews)"
          />
        </AreaChart>
    </ChartContainer>
  )
}
