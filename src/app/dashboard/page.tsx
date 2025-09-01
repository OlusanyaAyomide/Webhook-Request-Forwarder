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
import Link from "next/link";

export default async function DashboardPage() {
  const projects = await prisma.project.findMany();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button asChild>
          <Link href="/dashboard/new">New Project</Link>
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Forwarder URL</TableHead>
              <TableHead>Path Segment</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id} className="cursor-pointer">
                <TableCell>
                  <Link href={`/dashboard/p/${project.pathSegment}`}>
                    {project.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/dashboard/p/${project.pathSegment}`}>
                    {project.forwarderBaseUrl}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/dashboard/p/${project.pathSegment}`}>
                    {project.pathSegment}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/dashboard/p/${project.pathSegment}`}>
                    {project.createdAt.toLocaleDateString()}
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
