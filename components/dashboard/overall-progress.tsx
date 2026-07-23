"use client"

import { Label, Pie, PieChart } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

export function OverallProgress({
  planned,
  actual,
}: {
  planned: number
  actual: number
}) {
  const delay = Math.max(planned - actual, 0)
  const data = [
    { key: "actual", value: actual, fill: "var(--chart-1)" },
    { key: "remainder", value: Math.max(100 - actual, 0), fill: "var(--muted)" },
  ]

  const legend = [
    { label: "Planned", value: planned, color: "var(--chart-2)" },
    { label: "Actual", value: actual, color: "var(--chart-1)" },
    { label: "Delay", value: delay, color: "var(--destructive)" },
  ]

  return (
    <div className="flex items-center gap-6">
      <ChartContainer
        config={{ actual: { label: "Actual" } }}
        className="aspect-square h-32 w-32"
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="key"
            innerRadius={44}
            outerRadius={60}
            strokeWidth={0}
            startAngle={90}
            endAngle={-270}
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
                        {actual}%
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>

      <ul className="flex flex-col gap-2">
        {legend.map((l) => (
          <li key={l.label} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: l.color }}
              aria-hidden
            />
            <span className="w-16 text-muted-foreground">{l.label}</span>
            <span className="font-mono font-medium tabular-nums">
              {l.value}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
