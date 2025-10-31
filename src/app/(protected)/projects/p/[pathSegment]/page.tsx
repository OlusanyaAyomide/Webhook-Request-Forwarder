import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Eye } from "lucide-react";
import Pagination from "@/components/protected/Pagination";
import { ProjectStats } from "@/components/protected/ProjectStats";
import ProjectConfiguration from "@/components/protected/ProjectConfiguration";
import { CopyButton } from "@/components/protected/CopyButton";
import { currentUser } from "@clerk/nextjs/server";
import { ProgressLink } from "@/components/protected/ProgressLink";
import { getProjectStats } from "./stat.actions";
import { RequestLogsFilter } from "@/components/protected/RequestLogsFilter";
import WebhookBaseUrl from "@/home/components/WebhookBaseUrl";

export const dynamic = "force-dynamic";

interface SearchParams {
  page?: string;
  search?: string;
  method?: string;
  status?: string;
}

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: any;
  searchParams: Promise<SearchParams>;
}) {
  const pageParam = await params;
  const searchParam = await searchParams;

  const page = Number(searchParam.page) || 1;
  const search = searchParam.search || "";
  const method = searchParam.method || "all";
  const status = searchParam.status || "all-status";

  const pageSize = 20;
  const skip = (page - 1) * pageSize;
  const user = await currentUser();

  const userEmail = user?.emailAddresses[0].emailAddress;

  if (!userEmail) {
    return notFound();
  }

  // Build filter conditions
  const whereConditions: any = {
    project: {
      pathSegment: pageParam.pathSegment,
      User: {
        email: userEmail,
      },
    },
  };

  // Add search filter
  if (search) {
    whereConditions.OR = [
      { incomingPath: { contains: search, mode: "insensitive" } },
      { fullIncomingUrl: { contains: search, mode: "insensitive" } },
      { forwardedUrl: { contains: search, mode: "insensitive" } },
    ];
  }

  // Add method filter
  if (method !== "all") {
    whereConditions.method = method;
  }

  // Add status filter
  if (status !== "all-status") {
    if (status === "2xx") {
      whereConditions.responseStatus = { gte: 200, lt: 300 };
    } else if (status === "4xx") {
      whereConditions.responseStatus = { gte: 400, lt: 500 };
    } else if (status === "5xx") {
      whereConditions.responseStatus = { gte: 500, lt: 600 };
    }
  }

  const [project, totalLogs, apps] = await prisma.$transaction(async (tx) => {
    const currentProject = await tx.project.findUnique({
      where: {
        pathSegment: pageParam.pathSegment,
        User: {
          email: userEmail,
        },
      },
      include: {
        app: {
          select: {
            url: true
          }
        }
      }
    });

    if (!currentProject) {
      return [null, 0, []];
    }

    // Get filtered request logs
    const logs = await tx.requestLog.findMany({
      where: {
        projectId: currentProject.id,
        ...(search && {
          OR: [
            { incomingPath: { contains: search, mode: "insensitive" } },
            { fullIncomingUrl: { contains: search, mode: "insensitive" } },
            { forwardedUrl: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(method !== "all" && { method }),
        ...(status === "2xx" && { responseStatus: { gte: 200, lt: 300 } }),
        ...(status === "4xx" && { responseStatus: { gte: 400, lt: 500 } }),
        ...(status === "5xx" && { responseStatus: { gte: 500, lt: 600 } }),
      },
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });

    // Get total count with same filters
    const count = await tx.requestLog.count({
      where: {
        projectId: currentProject.id,
        ...(search && {
          OR: [
            { incomingPath: { contains: search, mode: "insensitive" } },
            { fullIncomingUrl: { contains: search, mode: "insensitive" } },
            { forwardedUrl: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(method !== "all" && { method }),
        ...(status === "2xx" && { responseStatus: { gte: 200, lt: 300 } }),
        ...(status === "4xx" && { responseStatus: { gte: 400, lt: 500 } }),
        ...(status === "5xx" && { responseStatus: { gte: 500, lt: 600 } }),
      },
    });

    const userApps = await tx.apps.findMany({
      where: {
        User: {
          email: userEmail,
        },
      },
    });

    return [
      { ...currentProject, requestLogs: logs },
      count,
      userApps,
    ];
  });

  if (!project) {
    notFound();
  }

  const stats = await getProjectStats(project.id);

  if (!stats) {
    return notFound();
  }

  const totalPages = Math.ceil(totalLogs / pageSize);

  const getStatusBadge = (status: number) => {
    if (status >= 200 && status < 300) {
      return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Success</Badge>;
    } else if (status >= 400 && status < 500) {
      return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Client Error</Badge>;
    } else if (status >= 500) {
      return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Server Error</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Back Button & Header */}
      <div>
        <div className="flex justify-between items-center">
          <Button variant="ghost" asChild className="mb-4 -ml-2">
            <ProgressLink href="/projects">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </ProgressLink>
          </Button>
          <Badge
            className={`text-sm  h-10 flex justify-center  ${project.isLive
              ? 'bg-green-500/20 w-[100px] text-green-600 dark:text-green-400 '
              : 'bg-gray-500/20 text-gray-600 sm:w-[110px] dark:text-gray-400'
              }`}
          >
            {project.isLive ? 'Live' : 'Development'}
          </Badge>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <p className="text-muted-foreground mt-1">
              Created {project.createdAt.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span />
          </div>
        </div>
      </div>

      {/* URL Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Incoming Webhook URL</CardTitle>
            <CardDescription>Send requests to this endpoint</CardDescription>
          </CardHeader>
          <CardContent>
            <WebhookBaseUrl
              pathSegment={project.pathSegment}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Forwarder URL</CardTitle>
            <CardDescription>Requests are forwarded here</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm bg-muted px-3 py-2 rounded overflow-x-auto font-mono">
                {project.forwarderBaseUrl}
              </code>
              <CopyButton
                text={project.forwarderBaseUrl}
                customMessage="Base Url Copied to clipboard"
              />
            </div>
          </CardContent>
        </Card>
      </div>
      {
        project.isLive && (
          <p className="text-base font-medium py-4 pl-1">
            Project is live, Request will be forwarded to "{project.app?.url}"
          </p>
        )
      }

      {/* Tabs Section */}
      <Tabs defaultValue="logs" className="space-y-6">
        <TabsList>
          <TabsTrigger value="logs">Request Logs</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          {/* Filters */}
          <RequestLogsFilter
            defaultSearch={search}
            defaultMethod={method}
            defaultStatus={status}
          />

          {/* Request Logs Table */}
          <div className="shadow-sm border-x border-[var(--primary)]/20 rounded-md">
            <Table className="rounded-t-md overflow-hidden border-none">
              <TableHeader>
                <TableRow className="bg-[var(--primary)] h-10 md:h-12 lg:h-14 rounded-t-lg text-white">
                  <TableHead className="font-medium">Timestamp</TableHead>
                  <TableHead className="font-medium">Method</TableHead>
                  <TableHead className="font-medium">Path</TableHead>
                  <TableHead className="font-medium">Event</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium">Status Code</TableHead>
                  <TableHead className="font-medium">Duration</TableHead>
                  <TableHead className="font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {project.requestLogs.length === 0 ? (
                  <TableRow className="border-none">
                    <TableCell colSpan={8} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <p className="text-lg font-medium">
                          {search || method !== "all" || status !== "all-status"
                            ? "No matching requests found"
                            : "No requests yet"}
                        </p>
                        <p className="text-sm mt-1">
                          {search || method !== "all" || status !== "all-status"
                            ? "Try adjusting your filters"
                            : "Requests will appear here once received"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  project.requestLogs.map((log) => (
                    <TableRow
                      key={log.id}
                      className="even:bg-[var(--accent)] border-b-[var(--primary)]/20 transition-colors hover:bg-[var(--muted)]/50"
                    >
                      <TableCell className="text-sm">
                        {new Date(log.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {log.method}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm max-w-[200px] truncate">
                        {log.incomingPath}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {(log.requestBody as unknown as { event: string })?.event || "N/A"}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(log.responseStatus || 0)}
                      </TableCell>
                      <TableCell>
                        {log.responseStatus}
                      </TableCell>
                      <TableCell className="text-sm">
                        {log.durationMs}ms
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="hover:bg-[var(--primary)]/5 hover:text-[var(--primary)]"
                        >
                          <ProgressLink href={`/projects/p/${project.pathSegment}/requests/${log.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </ProgressLink>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
              />
            )}
          </div>

          {/* Stats Footer */}
          {project.requestLogs.length > 0 && (
            <div className="text-sm text-muted-foreground py-5 pl-2">
              Showing {skip + 1} to {Math.min(skip + pageSize, totalLogs)} of {totalLogs} requests
            </div>
          )}
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <ProjectConfiguration
            project={project}
            apps={apps}
          />
        </TabsContent>

        <TabsContent value="stats">
          <ProjectStats stats={stats} />
        </TabsContent>
      </Tabs>
    </div>
  );
}