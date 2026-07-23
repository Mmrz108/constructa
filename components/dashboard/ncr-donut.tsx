"use client"

import { Cell, Label, Pie, PieChart, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import type { NcrBreakdown } from "@/lib/queries"
import { NCR_COLORS } from "@/components/dashboard/chart-colors"

export function NcrDonut({ data }: { data: NcrBreakdown }) {
  const factors = [
    {
      key: "open",
      label: "Open",
      value: data.open,
      color: NCR_COLORS.open,
    },
    {
      key: "inReview",
      label: "In Review",
      value: data.inReview,
      color: NCR_COLORS.inReview,
    },
    {
      key: "closed",
      label: "Closed",
      value: data.closed,
      color: NCR_COLORS.closed,
    },
  ]

  const chartData =
    data.total === 0
      ? factors.map((f) => ({ ...f, value: 1 }))
      : factors.filter((f) => f.value > 0)

  const isEmpty = data.total === 0

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <ChartContainer
        config={{
          open: { label: "Open", color: NCR_COLORS.open },
          inReview: { label: "In Review", color: NCR_COLORS.inReview },
          closed: { label: "Closed", color: NCR_COLORS.closed },
        }}
        className="aspect-square h-40 w-40"
      >
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="label"
            innerRadius={48}
            outerRadius={72}
            strokeWidth={2}
            stroke="var(--card)"
            paddingAngle={2}
            startAngle={90}
            endAngle={-270}
          >
            {chartData.map((s) => (
              <Cell key={s.key} fill={s.color} fillOpacity={isEmpty ? 0.35 : 1} />
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
                        y={(viewBox.cy ?? 0) - 6}
                        className="fill-foreground font-mono text-2xl font-semibold"
                      >
                        {data.total}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy ?? 0) + 14}
                        className="fill-muted-foreground text-[10px]"
                      >
                        Total
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </Pie>
          <Tooltip
            formatter={(value, name) => [value, String(name)]}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid var(--border)",
              fontSize: 12,
            }}
          />
        </PieChart>
      </ChartContainer>

      <ul className="flex w-full flex-col gap-2 sm:w-auto">
        {factors.map((l) => (
          <li
            key={l.key}
            className="flex items-center justify-between gap-3 text-sm sm:justify-start"
          >
            <span className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: l.color }}
                aria-hidden
              />
              <span className="w-20 text-muted-foreground">{l.label}</span>
            </span>
            <span className="font-mono font-medium tabular-nums">{l.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
