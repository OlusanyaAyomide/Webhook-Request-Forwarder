'use client'

import React from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

interface StatusCodeDistribution {
  name: string
  value: number
  color: string
}

interface PieChartContainerProps {
  data: StatusCodeDistribution[]
}

export default function PieChartContainer({ data }: PieChartContainerProps) {
  // Check if there's any data
  const hasData = data && data.length > 0 && data.some(item => item.value > 0)

  if (!hasData) {
    return (
      <div className="w-full h-[250px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">No data available yet</p>
          <p className="text-muted-foreground text-sm mt-2">
            Status code distribution will appear here once you have request logs
          </p>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          //eslint-disable-next-line  @typescript-eslint/no-explicit-any
          data={data as any}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name} (${(percent as number * 100).toFixed(0)}%)`
          }
          outerRadius={80}
          fill="var(--primary)"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--popover)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--popover-foreground)',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}