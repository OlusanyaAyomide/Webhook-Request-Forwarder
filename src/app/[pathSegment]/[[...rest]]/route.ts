import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const hopByHopHeaders = [
  "Connection",
  "Keep-Alive",
  "Proxy-Authenticate",
  "Proxy-Authorization",
  "TE",
  "Trailers",
  "Transfer-Encoding",
  "Upgrade",
];

function isTextBasedContentType(contentType: string | null): boolean {
  if (!contentType) return true;
  const type = contentType.toLowerCase();
  return (
    type.startsWith("text/") ||
    type.startsWith("application/json") ||
    type.startsWith("application/xml") ||
    type.startsWith("application/javascript")
  );
}
function tryParseJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text; // not JSON, keep as raw text
  }
}

async function handler(
  req: NextRequest,
  //eslint-disable-next-line  @typescript-eslint/no-explicit-any
  context: any
) {

  const reqParam = await context.params
  const pathSegment = reqParam.pathSegment as string
  const rest = context.params.rest as string[] | undefined

  const project = await prisma.project.findUnique({
    where: { pathSegment },
    include: {
      app: true
    }
  });

  if (!project) {
    return NextResponse.json({ error: "Unknown project" }, { status: 404 });
  }

  const incomingPath = `/${rest?.join("/") || ""}`;
  const searchParams = req.nextUrl.search;
  const forwardedUrl = `${project.isLive ? project.app?.url : project.forwarderBaseUrl}${incomingPath}${searchParams}`;

  const headers = new Headers(req.headers);
  hopByHopHeaders.forEach((h) => headers.delete(h));
  headers.set("X-Forwarded-For", (req.headers.get("x-forwarded-for")) ?? "unknown");
  headers.set("X-Forwarded-Host", req.nextUrl.host);
  headers.set("X-Forwarded-Proto", req.nextUrl.protocol.replace(":", ""));

  const requestBody = Buffer.from(await req.arrayBuffer());

  const startTime = Date.now();
  const fetchOptions: RequestInit = {
    method: req.method,
    headers: headers,
    redirect: "manual",
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    fetchOptions.body = requestBody;
  }

  const response = await fetch(forwardedUrl, fetchOptions);
  const durationMs = Date.now() - startTime;

  const requestBodyIsText = isTextBasedContentType(req.headers.get("content-type"));
  const responseBodyIsText = isTextBasedContentType(response.headers.get("content-type"));

  const responseBuffer = Buffer.from(await response.arrayBuffer());

  const requestBodyForDb = requestBodyIsText
    ? tryParseJson(requestBody.toString("utf-8"))
    : requestBody.toString("base64");

  const responseBody = responseBodyIsText
    ? responseBuffer.toString("utf-8")
    : responseBuffer.toString("base64");

  const responseBodyForDb = responseBodyIsText
    ? tryParseJson(responseBuffer.toString("utf-8"))
    : responseBuffer.toString("base64");



  await prisma.requestLog.create({
    data: {
      projectId: project.id,
      method: req.method,
      incomingPath,
      fullIncomingUrl: req.url,
      forwardedUrl,
      requestHeaders: Object.fromEntries(req.headers.entries()),
      query: searchParams,
      requestBody: requestBodyForDb,
      responseStatus: response.status,
      responseHeaders: Object.fromEntries(response.headers.entries()),
      responseBody: responseBodyForDb,
      durationMs,
    },
  });

  return new NextResponse(responseBody, {
    status: response.status,
    headers: response.headers,
  });
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE, handler as OPTIONS, handler as HEAD };