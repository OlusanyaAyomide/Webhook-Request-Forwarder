import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function JsonViewer({ json }: { json: object }) {
  return (
    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
      {JSON.stringify(json, null, 2)}
    </pre>
  );
}

export default async function RequestDetailPage({
  params,
}: {
  //eslint-disable-next-line  @typescript-eslint/no-explicit-any
  params: any;
}) {

  const reqParams = await params
  const log = await prisma.requestLog.findUnique({
    where: { id: reqParams.requestId },
  });

  if (!log) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <strong>Method:</strong> {log.method}
          </div>
          <div>
            <strong>Incoming Path:</strong> {log.incomingPath}
          </div>
          <div>
            <strong>Full Incoming URL:</strong> {log.fullIncomingUrl}
          </div>
          <div>
            <strong>Forwarded URL:</strong> {log.forwardedUrl}
          </div>
          <div>
            <strong>Status:</strong> {log.responseStatus}
          </div>
          <div>
            <strong>Duration:</strong> {log.durationMs}ms
          </div>
          <div>
            <strong>Created At:</strong> {log.createdAt.toLocaleString()}
          </div>
          <Separator />
          <h3 className="text-xl font-bold">Request Headers</h3>
          <JsonViewer json={log.requestHeaders as object} />
          <h3 className="text-xl font-bold">Request Body</h3>
          <JsonViewer json={log.requestBody as object} />
          <Separator />
          <h3 className="text-xl font-bold">Response Headers</h3>
          <JsonViewer json={log.responseHeaders as object} />
          <h3 className="text-xl font-bold">Response Body</h3>
          <JsonViewer json={log.responseBody as object} />
        </CardContent>
      </Card>
    </div>
  );
}
