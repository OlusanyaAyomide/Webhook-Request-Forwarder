import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

import RequestDetailPage from "@/components/protected/RequestDetail";

function JsonViewer({ json }: { json: object }) {
  return (
    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
      {JSON.stringify(json, null, 2)}
    </pre>
  );
}

export default async function ViewRequestDetailPage({
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
    <RequestDetailPage
      log={log}
    />
  );
}
