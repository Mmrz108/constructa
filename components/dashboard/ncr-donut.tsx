"use client"

import { Label, Pie, PieChart } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import type { NcrBreakdown } from "@/lib/queries"

export function NcrDonut({ data }: { data: NcrBreakdown }) {
  const slices = [
    { key: "open", label: "Open", value: data.open, color: "var(--destructive)" },
    { key: "inReview", label: "In Review", value: data.inReview, color: "var(--warning)" },
    { key: "closed", label: "Closed", value: data.closed, color: "var(--success)" },
  ]
  const chartData = slices.map((s) => ({ key: s.key, value: s.value, fill: s.color }))

  return (
    <div className="flex items-center gap-6">
      <ChartContainer
        config={{ value: { label: "NCRs" } }}
        className="aspect-square h-36 w-36"
      >
        <PieChart>
          <Pie
            data={data.total === 0 ? [{ key: "empty", value: 1, fill: "var(--muted)" }] : chartData}
            dataKey="value"
            nameKey="key"
            innerRadius={48}
            outerRadius={66}
            strokeWidth={0}
            paddingAngle={data.total === 0 ? 0 : 2}
          >
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
                        className="fill-foreground font-mono text-2xl font-semibold"
                      >
                        {data.total}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy ?? 0) + 18}
                        className="fill-muted-foreground text-xs"
                      >
                        Total
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>

      <ul className="flex flex-col gap-2.5">
        {slices.map((s) => (
          <li key={s.key} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: s.color }}
              aria-hidden
            />
            <span className="w-20 text-muted-foreground">{s.label}</span>
            <span className="font-mono font-medium tabular-nums">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
