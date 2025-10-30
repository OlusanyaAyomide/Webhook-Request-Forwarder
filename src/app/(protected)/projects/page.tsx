import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { Plus, Eye } from "lucide-react";
import Pagination from "@/components/protected/Pagination";
import { currentUser } from "@clerk/nextjs/server";
import { ProgressLink } from "@/components/protected/ProgressLink";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams
}: {
  searchParams: { page?: string }
}) {
  const user = await currentUser()
  const page = Number(await searchParams?.page) || 1;
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const [projects, totalCount] = await Promise.all([
    prisma.project.findMany({
      where: {
        User: {
          email: user?.emailAddresses[0].emailAddress
        }
      },
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.project.count({
      where: {
        User: {
          email: user?.emailAddresses[0].emailAddress
        }
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);


  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex max-md:flex-col-reverse  md:items-center md:justify-between">
        <p className="text-muted-foreground mt-1 text-base lg:text-lg font-medium">
          Manage and monitor your projects
        </p>
        <Button asChild className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 h-10 md:h-12 w-[150px] md:w-[200px] lg:w-240[px] mb-6">
          <ProgressLink href="/projects/new">
            <Plus className="mr-2 h-5 w-5 shrink-0 text-white" />
            <span className="text-white">New Project</span>
          </ProgressLink>
        </Button>
      </div>

      {/* Table Section */}
      <div className="shadow-sm border-x border-[var(--primary)]/20 rounded-md">
        <Table className="rounded-t-md overflow-hidden border-none">
          <TableHeader>
            <TableRow className="bg-[var(--primary)] h-10 md:h-12 lg:h-14 rounded-t-lg text-white">
              <TableHead className="font-medium">Name</TableHead>
              <TableHead className="font-medium">Forwarder URL</TableHead>
              <TableHead className="font-medium">Path Segment</TableHead>
              <TableHead className="font-medium">Created</TableHead>
              <TableHead className="font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow className="border-none">
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <p className="text-lg font-medium">No projects yet</p>
                    <p className="text-sm mt-1">Create your first project to get started</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow
                  key={project.id}
                  className="even:bg-[var(--accent)] border-b-[var(--primary)]/20 transition-colors hover:bg-[var(--muted)]/50"
                >
                  <TableCell className="font-medium">
                    {project.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">
                    {project.forwarderBaseUrl}
                  </TableCell>
                  <TableCell>
                    <code className="px-2 py-1 rounded bg-muted text-xs font-mono">
                      {project.pathSegment}
                    </code>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(project.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="hover:bg-[var(--primary)]/5 hover:text-[var(--primary)]"
                    >
                      <ProgressLink href={`/projects/p/${project.pathSegment}`}>
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
      {projects.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {skip + 1} to {Math.min(skip + pageSize, totalCount)} of {totalCount} projects
        </div>
      )}
    </div>
  );
}