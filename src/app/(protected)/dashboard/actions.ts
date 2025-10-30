'use server'

import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma' // Adjust this import to your prisma client location

export interface DashboardStats {
  totalRequests: number
  requestsLast24h: number
  successRate: number
  avgDuration: number
  activeProjects: number
  projectsWithErrors: number
}

export interface RecentEvent {
  id: string
  projectName: string
  incomingUrl: string
  lastRequest: string
  eventType: string
}

export interface ProjectWithError {
  id: string
  name: string
  forwarderUrl: string
  lastRequest: string
  status: string
}

export interface RequestOverTime {
  time: string
  requests: number
}

export interface StatusCodeDistribution {
  name: string
  value: number
  color: string
}

export async function getDashboardStats(): Promise<DashboardStats | null> {
  try {
    const user = await currentUser()
    if (!user) return null

    const dbUser = await prisma.user.findUnique({
      where: { email: user.emailAddresses[0].emailAddress },
    })

    if (!dbUser) return null

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    // Get all request logs for user's projects
    const [
      totalRequests,
      requestsLast24h,
      successfulRequests,
      avgDurationResult,
      activeProjects,
      projectsWithErrorsCount,
    ] = await Promise.all([
      prisma.requestLog.count({
        where: {
          project: { userId: dbUser.id },
        },
      }),
      prisma.requestLog.count({
        where: {
          project: { userId: dbUser.id },
          createdAt: { gte: twentyFourHoursAgo },
        },
      }),
      prisma.requestLog.count({
        where: {
          project: { userId: dbUser.id },
          responseStatus: { gte: 200, lt: 300 },
        },
      }),
      prisma.requestLog.aggregate({
        where: {
          project: { userId: dbUser.id },
        },
        _avg: {
          durationMs: true,
        },
      }),
      prisma.project.count({
        where: {
          userId: dbUser.id,
          isLive: true,
        },
      }),
      prisma.project.count({
        where: {
          userId: dbUser.id,
          requestLogs: {
            some: {
              OR: [
                { responseStatus: { gte: 400 } },
                { error: { not: null } },
              ],
              createdAt: { gte: twentyFourHoursAgo },
            },
          },
        },
      }),
    ])

    const successRate = totalRequests > 0
      ? Math.round((successfulRequests / totalRequests) * 100)
      : 0

    return {
      totalRequests,
      requestsLast24h,
      successRate,
      avgDuration: Math.round(avgDurationResult._avg.durationMs || 0),
      activeProjects,
      projectsWithErrors: projectsWithErrorsCount,
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return null
  }
}

export async function getRecentEvents(): Promise<RecentEvent[]> {
  try {
    const user = await currentUser()
    if (!user) return []

    const dbUser = await prisma.user.findUnique({
      where: { email: user.emailAddresses[0].emailAddress },
    })

    if (!dbUser) return []

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

    const recentLogs = await prisma.requestLog.findMany({
      where: {
        project: { userId: dbUser.id },
        createdAt: { gte: oneHourAgo },
      },
      include: {
        project: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 3,
    })

    return recentLogs.map((log) => ({
      id: log.id,
      projectName: log.project.name,
      incomingUrl: log.fullIncomingUrl,
      lastRequest: new Date(log.createdAt).toLocaleString(),
      eventType: determineEventType(log.method, log.incomingPath),
    }))
  } catch (error) {
    console.error('Error fetching recent events:', error)
    return []
  }
}

export async function getProjectsWithErrors(): Promise<ProjectWithError[]> {
  try {
    const user = await currentUser()
    if (!user) return []

    const dbUser = await prisma.user.findUnique({
      where: { email: user.emailAddresses[0].emailAddress },
    })

    if (!dbUser) return []

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    const projectsWithErrors = await prisma.project.findMany({
      where: {
        userId: dbUser.id,
        requestLogs: {
          some: {
            OR: [
              { responseStatus: { gte: 400 } },
              { error: { not: null } },
            ],
            createdAt: { gte: twentyFourHoursAgo },
          },
        },
      },
      include: {
        requestLogs: {
          where: {
            OR: [
              { responseStatus: { gte: 400 } },
              { error: { not: null } },
            ],
            createdAt: { gte: twentyFourHoursAgo },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      take: 5,
    })

    return projectsWithErrors.map((project) => ({
      id: project.id,
      name: project.name,
      forwarderUrl: project.forwarderBaseUrl,
      lastRequest: new Date(project.requestLogs[0].createdAt).toLocaleString(),
      status: 'error',
    }))
  } catch (error) {
    console.error('Error fetching projects with errors:', error)
    return []
  }
}

export async function getRequestsOverTime(): Promise<RequestOverTime[]> {
  try {
    const user = await currentUser()
    if (!user) return []

    const dbUser = await prisma.user.findUnique({
      where: { email: user.emailAddresses[0].emailAddress },
    })

    if (!dbUser) return []

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    const logs = await prisma.requestLog.findMany({
      where: {
        project: { userId: dbUser.id },
        createdAt: { gte: twentyFourHoursAgo },
      },
      select: {
        createdAt: true,
      },
    })

    // Group by 4-hour intervals
    const intervals = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
    const grouped = intervals.map((time) => ({ time, requests: 0 }))

    logs.forEach((log) => {
      const hour = log.createdAt.getHours()
      const intervalIndex = Math.floor(hour / 4)
      if (intervalIndex < grouped.length) {
        grouped[intervalIndex].requests++
      }
    })

    return grouped
  } catch (error) {
    console.error('Error fetching requests over time:', error)
    return []
  }
}

export async function getStatusCodeDistribution(): Promise<StatusCodeDistribution[]> {
  try {
    const user = await currentUser()
    if (!user) return []

    const dbUser = await prisma.user.findUnique({
      where: { email: user.emailAddresses[0].emailAddress },
    })

    if (!dbUser) return []

    const logs = await prisma.requestLog.groupBy({
      where: {
        project: { userId: dbUser.id },
      },
      by: ['responseStatus'],
      _count: {
        responseStatus: true,
      },
    })

    const distribution = {
      '2xx': 0,
      '4xx': 0,
      '404': 0,
      '500': 0,
    }

    logs.forEach((log) => {
      const status = log.responseStatus
      if (status >= 200 && status < 300) {
        distribution['2xx'] += log._count.responseStatus
      } else if (status === 404) {
        distribution['404'] += log._count.responseStatus
      } else if (status >= 400 && status < 500) {
        distribution['4xx'] += log._count.responseStatus
      } else if (status >= 500) {
        distribution['500'] += log._count.responseStatus
      }
    })

    return [
      { name: '2xx', value: distribution['2xx'], color: '#10b981' },
      { name: '4xx', value: distribution['4xx'], color: '#f59e0b' },
      { name: '404', value: distribution['404'], color: '#f97316' },
      { name: '500', value: distribution['500'], color: '#ef4444' },
    ].filter((item) => item.value > 0)
  } catch (error) {
    console.error('Error fetching status code distribution:', error)
    return []
  }
}

export async function getRecentEventsCount(): Promise<number> {
  try {
    const user = await currentUser()
    if (!user) return 0

    const dbUser = await prisma.user.findUnique({
      where: { email: user.emailAddresses[0].emailAddress },
    })

    if (!dbUser) return 0

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

    return await prisma.requestLog.count({
      where: {
        project: { userId: dbUser.id },
        createdAt: { gte: oneHourAgo },
      },
    })
  } catch (error) {
    console.error('Error fetching recent events count:', error)
    return 0
  }
}

function determineEventType(method: string, path: string): string {
  // Customize this based on your application's logic
  if (method === 'POST' && path.includes('deposit')) {
    return 'Transfer Deposit Event'
  }
  if (method === 'POST') {
    return 'POST Event'
  }
  if (method === 'GET') {
    return 'GET Request'
  }
  return `${method} Request`
}