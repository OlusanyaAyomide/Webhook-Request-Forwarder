"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


interface StatsData {
  totalRequests: number;
  successRate: number;
  avgDuration: number;
  failedRequests: number;
  requestsOverTime: Array<{
    date: string;
    requests: number;
    success: number;
  }>;
  statusCodes: Array<{
    code: string;
    count: number;
  }>;
  responseTimeDistribution: {
    fast: number;
    average: number;
    slow: number;
  };
  topPaths: Array<{
    path: string;
    count: number;
  }>;
}

interface ProjectStatsProps {
  stats: StatsData;
}

export function ProjectStats({ stats }: ProjectStatsProps) {
  // Show empty state if no requests
  if (stats.totalRequests === 0) {
    return (
      <div className="space-y-6 pb-20">
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-6 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              >
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No Request Data Yet</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Start sending requests to your webhook endpoint to see analytics and statistics here.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalRequests.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.successRate}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.avgDuration}ms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Failed Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.failedRequests}</p>
          </CardContent>
        </Card>
      </div>

      {/* Requests Over Time Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Requests Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.requestsOverTime}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-sm"
                stroke="currentColor"
              />
              <YAxis
                className="text-sm"
                stroke="currentColor"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Line
                type="monotone"
                dataKey="requests"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Total"
                dot={{ fill: '#3b82f6' }}
              />
              <Line
                type="monotone"
                dataKey="success"
                stroke="#10b981"
                strokeWidth={2}
                name="Success"
                dot={{ fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Status Codes Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Top Status Codes</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.statusCodes}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="code"
                className="text-sm"
                stroke="currentColor"
              />
              <YAxis
                className="text-sm"
                stroke="currentColor"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Bar
                dataKey="count"
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Response Time Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Fast (&lt;100ms)</span>
                <span className="text-sm font-medium">{stats.responseTimeDistribution.fast}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${stats.responseTimeDistribution.fast}%` }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average (100-500ms)</span>
                <span className="text-sm font-medium">{stats.responseTimeDistribution.average}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${stats.responseTimeDistribution.average}%` }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Slow (&gt;500ms)</span>
                <span className="text-sm font-medium">{stats.responseTimeDistribution.slow}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${stats.responseTimeDistribution.slow}%` }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Request Paths</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topPaths.length > 0 ? (
                stats.topPaths.map((item) => (
                  <div key={item.path} className="flex items-center justify-between">
                    <span className="text-sm font-mono truncate max-w-[200px]">{item.path}</span>
                    <span className="text-sm font-medium text-muted-foreground">
                      {item.count}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No requests yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}