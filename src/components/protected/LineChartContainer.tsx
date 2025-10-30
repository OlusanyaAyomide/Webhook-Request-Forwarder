'use client'

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface RequestOverTime {
  time: string
  requests: number
}

interface LineChartContainerProps {
  data: RequestOverTime[]
}

export default function LineChartContainer({ data }: LineChartContainerProps) {
  // Check if there's any data
  const hasData = data && data.length > 0 && data.some(item => item.requests > 0)

  if (!hasData) {
    return (
      <div className="w-full h-[250px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">No data available yet</p>
          <p className="text-muted-foreground text-sm mt-2">
            Request activity will appear here once you have request logs
          </p>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="time" stroke="var(--muted-foreground)" />
        <YAxis stroke="var(--muted-foreground)" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--popover)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--popover-foreground)',
          }}
        />
        <Line
          type="monotone"
          dataKey="requests"
          stroke="var(--primary)"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}