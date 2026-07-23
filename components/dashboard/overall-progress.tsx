"use client"

import { Cell, Label, Pie, PieChart, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { PROGRESS_COLORS } from "@/components/dashboard/chart-colors"

export function OverallProgress({
  planned,
  actual,
}: {
  planned: number
  actual: number
}) {
  const safePlanned = Math.max(0, Math.min(100, planned))
  const safeActual = Math.max(0, Math.min(100, actual))
  const delay = Math.max(safePlanned - safeActual, 0)
  const remaining = Math.max(100 - Math.max(safePlanned, safeActual), 0)
  const ahead = Math.max(safeActual - safePlanned, 0)

  const slices = [
    {
      key: "actual",
      label: "Actual",
      value: safeActual - ahead,
      color: PROGRESS_COLORS.actual,
      show: true,
    },
    {
      key: "ahead",
      label: "Ahead",
      value: ahead,
      color: PROGRESS_COLORS.ahead,
      show: ahead > 0,
    },
    {
      key: "delay",
      label: "Delay",
      value: delay,
      color: PROGRESS_COLORS.delay,
      show: delay > 0,
    },
    {
      key: "remaining",
      label: "Remaining",
      value: remaining,
      color: PROGRESS_COLORS.remaining,
      show: remaining > 0,
    },
  ].filter((s) => s.show && s.value > 0)

  const chartSlices =
    slices.length > 0
      ? slices
      : [
          {
            key: "empty",
            label: "No data",
            value: 1,
            color: PROGRESS_COLORS.remaining,
            show: true,
          },
        ]

  const legend = [
    { label: "Planned", value: safePlanned, color: PROGRESS_COLORS.planned },
    { label: "Actual", value: safeActual, color: PROGRESS_COLORS.actual },
    { label: "Delay", value: delay, color: PROGRESS_COLORS.delay },
    { label: "Remaining", value: remaining, color: PROGRESS_COLORS.remaining },
  ]

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <ChartContainer
        config={{
          actual: { label: "Actual", color: PROGRESS_COLORS.actual },
          delay: { label: "Delay", color: PROGRESS_COLORS.delay },
          remaining: { label: "Remaining", color: PROGRESS_COLORS.remaining },
          ahead: { label: "Ahead", color: PROGRESS_COLORS.ahead },
        }}
        className="aspect-square h-40 w-40"
      >
        <PieChart>
          <Pie
            data={chartSlices}
            dataKey="value"
            nameKey="label"
            innerRadius={48}
            outerRadius={72}
            strokeWidth={2}
            stroke="var(--card)"
            paddingAngle={chartSlices.length > 1 ? 2 : 0}
            startAngle={90}
            endAngle={-270}
          >
            {chartSlices.map((s) => (
              <Cell key={s.key} fill={s.color} />
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
                        {safeActual}%
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy ?? 0) + 14}
                        className="fill-muted-foreground text-[10px]"
                      >
                        Actual
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value}%`, String(name)]}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid var(--border)",
              fontSize: 12,
            }}
          />
        </PieChart>
      </ChartContainer>

      <ul className="flex w-full flex-col gap-2 sm:w-auto">
        {legend.map((l) => (
          <li
            key={l.label}
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
            <span className="font-mono font-medium tabular-nums">
              {l.value}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
