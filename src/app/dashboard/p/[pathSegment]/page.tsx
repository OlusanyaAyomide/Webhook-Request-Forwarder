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
import Link from "next/link";

import { DeleteButton } from "./DeleteButton";
import { EditButton } from "./EditButton";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  //eslint-disable-next-line  @typescript-eslint/no-explicit-any
  params: any;
}) {
  const pageParam = await params
  const project = await prisma.project.findUnique({
    where: { pathSegment: pageParam.pathSegment },
    include: { requestLogs: { take: 10, orderBy: { createdAt: "desc" } } },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>{project.name}</CardTitle>
          <CardDescription>
            <p>Forwarder Base URL: {project.forwarderBaseUrl}</p>
            <p>Path Segment: {project.pathSegment}</p>
            <p>Created At: {project.createdAt.toLocaleDateString()}</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <EditButton project={project} />
            <DeleteButton pathSegment={project.pathSegment} />
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mt-8 mb-4">Request Logs</h2>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Method</TableHead>
              <TableHead>Path</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {project.requestLogs.map((log) => (
              <TableRow className="cursor-pointer" key={log.id}>
                <TableCell>
                  <Badge>{log.method}</Badge>
                </TableCell>
                <TableCell>{log.incomingPath}</TableCell>
                <TableCell>{log.responseStatus}</TableCell>
                <TableCell>{log.durationMs}ms</TableCell>
                <TableCell>{(log.requestBody as unknown as any)?.event || "N/A"}</TableCell>
                <TableCell>{log.createdAt.toLocaleString()}</TableCell>
                <TableCell>
                  <Link
                    href={`/dashboard/p/${project.pathSegment}/requests/${log.id}`}
                    className="contents"
                  >
                    <span>View</span>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
