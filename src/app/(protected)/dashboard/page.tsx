import { Card } from '@/components/ui/card'
import {
  Activity,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Clock,
  Zap,
  Plus,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import LineChartContainer from '@/components/protected/LineChartContainer'
import PieChartContainer from '@/components/protected/PieChartContainer'
import {
  getDashboardStats,
  getRecentEvents,
  getProjectsWithErrors,
  getRequestsOverTime,
  getStatusCodeDistribution,
  getRecentEventsCount,
} from './actions'
import { ProgressLink } from '@/components/protected/ProgressLink'

export default async function Dashboard() {

  // Fetch all data in parallel
  const [
    stats,
    recentEvents,
    projectsWithErrors,
    requestsOverTime,
    statusCodeDistribution,
    recentEventsCount,
  ] = await Promise.all([
    getDashboardStats(),
    getRecentEvents(),
    getProjectsWithErrors(),
    getRequestsOverTime(),
    getStatusCodeDistribution(),
    getRecentEventsCount(),
  ])

  // Default values if data is not available
  const dashboardStats = stats || {
    totalRequests: 0,
    requestsLast24h: 0,
    successRate: 0,
    avgDuration: 0,
    activeProjects: 0,
    projectsWithErrors: 0,
  }

  return (
    <div className="space-y-6">
      <div>
        <Button className="text-white ml-auto h-10 md:h-12 w-[170px] md:w-[200px] lg:w-240[px] mb-6">
          <ProgressLink href={'/projects/new'} className="flex items-center">
            <Plus className="shrink-0 h-5 w-5" />
            Create New Project
          </ProgressLink>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Requests */}
        <Card className="bg-card border border-sidebar-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground mb-1">Total Requests</p>
              <p className="text-foreground text-3xl font-semibold">
                {dashboardStats.totalRequests.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/10">
              <Activity className="w-6 h-6 t text-blue-500" />
            </div>
          </div>
        </Card>

        {/* Last 24 Hours */}
        <Card className="bg-card border border-sidebar-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground mb-1">Last 24 Hours</p>
              <p className="text-foreground text-3xl font-semibold">
                {dashboardStats.requestsLast24h.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[var(--primary)]/10">
              <TrendingUp className="w-6 h-6 text-[var(--primary)]" />
            </div>
          </div>
        </Card>

        {/* Success Rate */}
        <Card className="bg-card border border-sidebar-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground mb-1">Success Rate</p>
              <p className="text-foreground text-3xl font-semibold">
                {dashboardStats.successRate}%
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </Card>

        {/* Average Duration */}
        <Card className="bg-card border border-sidebar-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground mb-1">Avg Duration</p>
              <p className="text-foreground text-3xl font-semibold">
                {dashboardStats.avgDuration}ms
              </p>
            </div>
            <div className="p-3 rounded-lg bg-orange-500/10">
              <Clock className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </Card>

        {/* Active Projects */}
        <Card className="bg-card border border-sidebar-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground mb-1">Active Projects</p>
              <p className="text-foreground text-3xl font-semibold">
                {dashboardStats.activeProjects}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500/10">
              <Zap className="w-6 h-6  text-yellow-500" />
            </div>
          </div>
        </Card>

        {/* Projects with Errors */}
        <Card className="bg-card border border-sidebar-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground mb-1">Projects with Errors</p>
              <p className="text-foreground text-3xl font-semibold">
                {dashboardStats.projectsWithErrors}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-400/10">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border border-sidebar-border p-6">
          <h3 className="text-foreground mb-4">Requests Over Time</h3>
          <LineChartContainer data={requestsOverTime} />
        </Card>

        <Card className="bg-card border border-sidebar-border p-6">
          <h3 className="text-foreground mb-4">Status Code Distribution</h3>
          <PieChartContainer data={statusCodeDistribution} />
        </Card>
      </div>

      {/* Recent Events */}
      <Card className="bg-card border border-sidebar-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Recent Events
          </h3>
          <Badge className="bg-green-500/20 text-green-500 text-xs">
            {recentEventsCount} Event{recentEventsCount !== 1 ? 's' : ''} in the last hour
          </Badge>
        </div>

        {recentEvents.length > 0 ? (
          <div className="divide-y divide-border">
            {recentEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between py-3 transition-colors hover:bg-muted/10"
              >
                <div className="flex items-center gap-3">
                  <div className="h-2.5 w-2.5 bg-green-500 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-foreground">{event.projectName}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.incomingUrl}
                    </p>
                  </div>
                </div>
                <div className="text-right pl-4">
                  <p className="text-foreground font-medium">
                    {event.eventType}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {event.lastRequest}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No recent events in the last hour
          </div>
        )}
      </Card>

      {/* Projects with Errors */}
      {projectsWithErrors.length > 0 && (
        <Card className="bg-card border border-sidebar-border p-6 mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Projects with Recent Errors
            </h3>
            <Badge className="bg-red-500/20 text-red-500">
              {projectsWithErrors.length} Recently Failed Event{projectsWithErrors.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          <div className="space-y-3">
            {projectsWithErrors.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/10 transition-colors hover:bg-destructive/20"
              >
                <div className="flex items-center gap-3">
                  <div className="h-2.5 w-2.5 bg-destructive rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-foreground">{project.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {project.forwarderUrl}
                    </p>
                  </div>
                </div>
                <div className="text-right pl-4">
                  <span className="inline-block px-3 py-1 text-sm rounded bg-destructive text-destructive-foreground">
                    Error
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {project.lastRequest}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}