import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

import RequestDetailPage from "@/components/protected/RequestDetail";
import { currentUser } from "@clerk/nextjs/server";


export default async function ViewRequestDetailPage({
  params,
}: {
  //eslint-disable-next-line  @typescript-eslint/no-explicit-any
  params: any;
}) {

  const reqParams = await params

  const user = await currentUser()
  const log = await prisma.requestLog.findUnique({
    where: {
      id: reqParams.requestId,
      project: {
        User: {
          email: user?.emailAddresses[0].emailAddress
        }
      }
    },
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
