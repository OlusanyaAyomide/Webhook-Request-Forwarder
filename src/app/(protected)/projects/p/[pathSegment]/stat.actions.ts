
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: {
    pathSegment: string;
  };
}

export async function getProjectStats(projectId: string) {

  const requestLogs = await prisma.requestLog.findMany({
    where: {
      projectId: projectId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const totalRequests = requestLogs.length;

  if (totalRequests === 0) {
    return {
      totalRequests: 0,
      successRate: 0,
      avgDuration: 0,
      failedRequests: 0,
      requestsOverTime: [],
      statusCodes: [],
      responseTimeDistribution: {
        fast: 0,
        average: 0,
        slow: 0,
      },
      topPaths: [],
    };
  }

  // Calculate success rate (2xx status codes)
  const successfulRequests = requestLogs.filter(
    (log) => log.responseStatus >= 200 && log.responseStatus < 300
  ).length;
  const successRate = parseFloat(((successfulRequests / totalRequests) * 100).toFixed(1));

  // Calculate average duration
  const totalDuration = requestLogs.reduce((sum, log) => sum + log.durationMs, 0);
  const avgDuration = Math.round(totalDuration / totalRequests);

  // Count failed requests (4xx and 5xx)
  const failedRequests = requestLogs.filter(
    (log) => log.responseStatus >= 400
  ).length;

  // Requests over time (last 7 days)
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const requestsByDay = new Map<string, { total: number; success: number }>();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    requestsByDay.set(dateKey, { total: 0, success: 0 });
  }

  requestLogs.forEach((log) => {
    const logDate = new Date(log.createdAt);
    if (logDate >= sevenDaysAgo) {
      const dateKey = logDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const dayData = requestsByDay.get(dateKey);
      if (dayData) {
        dayData.total++;
        if (log.responseStatus >= 200 && log.responseStatus < 300) {
          dayData.success++;
        }
      }
    }
  });

  const requestsOverTime = Array.from(requestsByDay.entries()).map(([date, data]) => ({
    date,
    requests: data.total,
    success: data.success,
  }));

  // Status codes distribution
  const statusCodeMap = new Map<number, number>();
  requestLogs.forEach((log) => {
    const count = statusCodeMap.get(log.responseStatus) || 0;
    statusCodeMap.set(log.responseStatus, count + 1);
  });

  const statusCodes = Array.from(statusCodeMap.entries())
    .map(([code, count]) => ({
      code: code.toString(),
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Response time distribution
  const fastCount = requestLogs.filter((log) => log.durationMs < 100).length;
  const averageCount = requestLogs.filter(
    (log) => log.durationMs >= 100 && log.durationMs <= 500
  ).length;
  const slowCount = requestLogs.filter((log) => log.durationMs > 500).length;

  const responseTimeDistribution = {
    fast: Math.round((fastCount / totalRequests) * 100),
    average: Math.round((averageCount / totalRequests) * 100),
    slow: Math.round((slowCount / totalRequests) * 100),
  };

  // Top request paths
  const pathMap = new Map<string, number>();
  requestLogs.forEach((log) => {
    const count = pathMap.get(log.incomingPath) || 0;
    pathMap.set(log.incomingPath, count + 1);
  });

  const topPaths = Array.from(pathMap.entries())
    .map(([path, count]) => ({
      path,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalRequests,
    successRate,
    avgDuration,
    failedRequests,
    requestsOverTime,
    statusCodes,
    responseTimeDistribution,
    topPaths,
  };
}
