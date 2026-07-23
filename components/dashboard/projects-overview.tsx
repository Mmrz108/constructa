"use client"

import { Cell, Label, Pie, PieChart, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import type { ProjectStatusBreakdown } from "@/lib/queries"
import { PROJECT_STATUS_COLORS } from "@/components/dashboard/chart-colors"
import { FolderKanban, Loader, CircleCheck, CircleX } from "lucide-react"

export function ProjectsOverviewDonut({
  data,
}: {
  data: ProjectStatusBreakdown
}) {
  const slices = [
    {
      key: "inProgress",
      label: "In Progress",
      value: data.inProgress,
      color: PROJECT_STATUS_COLORS.inProgress,
    },
    {
      key: "completed",
      label: "Completed",
      value: data.completed,
      color: PROJECT_STATUS_COLORS.completed,
    },
    {
      key: "rejected",
      label: "Rejected",
      value: data.rejected,
      color: PROJECT_STATUS_COLORS.rejected,
    },
  ]

  const chartSlices = slices.filter((s) => s.value > 0)
  const pieData =
    chartSlices.length === 0
      ? [
          {
            key: "empty",
            label: "No projects",
            value: 1,
            color: PROJECT_STATUS_COLORS.empty,
          },
        ]
      : chartSlices

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
      <ChartContainer
        config={{
          inProgress: {
            label: "In Progress",
            color: PROJECT_STATUS_COLORS.inProgress,
          },
          completed: {
            label: "Completed",
            color: PROJECT_STATUS_COLORS.completed,
          },
          rejected: {
            label: "Rejected",
            color: PROJECT_STATUS_COLORS.rejected,
          },
        }}
        className="aspect-square h-44 w-44"
      >
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="label"
            innerRadius={58}
            outerRadius={80}
            strokeWidth={2}
            stroke="var(--card)"
            paddingAngle={pieData.length > 1 ? 2 : 0}
          >
            {pieData.map((s) => (
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
                        className="fill-foreground font-mono text-3xl font-semibold"
                      >
                        {data.total}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy ?? 0) + 16}
                        className="fill-muted-foreground text-xs"
                      >
                        Total Projects
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

      <ul className="flex w-full flex-col gap-3 sm:max-w-xs">
        {slices.map((s) => (
          <li
            key={s.key}
            className="flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2.5"
          >
            <span className="flex items-center gap-2 text-sm">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: s.color }}
                aria-hidden
              />
              <span className="text-muted-foreground">{s.label}</span>
            </span>
            <span className="font-mono text-base font-semibold tabular-nums">
              {s.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ProjectOverviewStats({
  data,
}: {
  data: ProjectStatusBreakdown
}) {
  const cards = [
    {
      label: "Total Projects",
      value: data.total,
      icon: FolderKanban,
      accent: "bg-primary/10 text-primary",
    },
    {
      label: "In Progress",
      value: data.inProgress,
      icon: Loader,
      accent: "bg-blue-500/15 text-blue-500",
    },
    {
      label: "Completed",
      value: data.completed,
      icon: CircleCheck,
      accent: "bg-green-500/15 text-green-500",
    },
    {
      label: "Rejected",
      value: data.rejected,
      icon: CircleX,
      accent: "bg-red-500/15 text-red-500",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="flex items-start justify-between gap-2 rounded-lg border bg-card p-3"
        >
          <div>
            <p className="text-xs text-muted-foreground">{c.label}</p>
            <p className="mt-1 font-mono text-2xl font-semibold tabular-nums">
              {c.value}
            </p>
          </div>
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${c.accent}`}
          >
            <c.icon className="h-4 w-4" />
          </span>
        </div>
      ))}
    </div>
  )
}
