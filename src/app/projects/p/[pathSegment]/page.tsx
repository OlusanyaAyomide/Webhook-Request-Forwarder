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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft, Copy, Eye } from "lucide-react";
import Pagination from "@/components/protected/Pagination";

import { ProjectStats } from "@/components/protected/ProjectStats";
import ProjectConfiguration from "@/components/protected/ProjectConfiguration";
import { CopyButton } from "@/components/protected/CopyButton";


export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: any;
  searchParams: Promise<{ page?: string }>;
}) {
  const pageParam = await params;
  const searchParam = await searchParams
  const page = Number(searchParam.page) || 1;
  const pageSize = 20;
  const skip = (page - 1) * pageSize;


  const [project, totalLogs] = await prisma.$transaction(async (tx) => {
    const currentProject = await tx.project.findUnique({
      where: { pathSegment: pageParam.pathSegment },
      include: {
        requestLogs: {
          skip,
          take: pageSize,
          orderBy: { createdAt: "desc" },
        },
      },
    })
    const currenttotalLogs = await tx.requestLog.count({
      where: { projectId: currentProject?.id },
    })

    return [
      currentProject,
      currenttotalLogs
    ]
  });


  if (!project) {
    notFound();
  }


  const totalPages = Math.ceil(totalLogs / pageSize);
  const incomingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/${project.pathSegment}`;

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
        <Button variant="ghost" asChild className="mb-4 -ml-2">
          <Link href="/projects">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Link>
        </Button>
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
            {/* <EditButton project={project} />
            <DeleteButton pathSegment={project.pathSegment} /> */}
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
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm bg-muted px-3 py-2 rounded overflow-x-auto font-mono">
                {incomingUrl}
              </code>
              <CopyButton
                text={incomingUrl}
                customMessage="Incoming Url Copied to clipboard"
              />
            </div>
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

      {/* Tabs Section */}
      <Tabs defaultValue="logs" className="space-y-6">
        <TabsList>
          <TabsTrigger value="logs">Request Logs</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Search logs..."
                  className="max-w-xs"
                />
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all-status">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-status">All Status</SelectItem>
                    <SelectItem value="2xx">2xx Success</SelectItem>
                    <SelectItem value="4xx">4xx Client Error</SelectItem>
                    <SelectItem value="5xx">5xx Server Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Request Logs Table */}
          <div className="shadow-sm border-x border-[var(--primary)]/20 rounded-md">
            <Table className="rounded-t-md overflow-hidden border-none">
              <TableHeader>
                <TableRow className="bg-[var(--primary)] h-10 md:h-12 lg:h-14 rounded-t-lg text-white">
                  <TableHead className="font-medium ">Timestamp</TableHead>
                  <TableHead className="font-medium ">Method</TableHead>
                  <TableHead className="font-medium ">Path</TableHead>
                  <TableHead className="font-medium ">Event</TableHead>
                  <TableHead className="font-medium ">Status</TableHead>
                  <TableHead className="font-medium ">Status Code</TableHead>
                  <TableHead className="font-medium ">Duration</TableHead>
                  <TableHead className="font-medium  text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {project.requestLogs.length === 0 ? (
                  <TableRow className="border-none">
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <p className="text-lg font-medium">No requests yet</p>
                        <p className="text-sm mt-1">Requests will appear here once received</p>
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
                          className="hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]"
                        >
                          <Link href={`/projects/p/${project.pathSegment}/requests/${log.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
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
                baseUrl={`/projects/p/${project.pathSegment}`}
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
          <ProjectConfiguration project={project} />
        </TabsContent>

        <TabsContent value="stats">
          <ProjectStats projectId={project.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}