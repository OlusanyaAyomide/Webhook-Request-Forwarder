"use client";

import { RequestLog } from "@prisma/client";
import { Card } from "../ui/card";
import { CopyButton } from "./CopyButton";

export function RawView({ log }: { log: RequestLog }) {
  const formatHeaders = (headers: Record<string, string>) => {
    return Object.entries(headers)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
  };

  const formatBody = (body: unknown) => {
    if (!body || (typeof body === "object" && Object.keys(body).length === 0)) {
      return "(empty)";
    }
    return JSON.stringify(body, null, 2);
  };

  const incomingRequest = `${log.method} ${log.incomingPath}

Headers:
${formatHeaders(log.requestHeaders as Record<string, string>)}

Body:
${formatBody(log.requestBody)}`;

  const forwardedTo = `${log.forwardedUrl || "N/A"}`;

  const response = `Status: ${log.responseStatus || "N/A"}

Headers:
${formatHeaders(log.responseHeaders as Record<string, string>)}

Body:
${formatBody(log.responseBody)}`;

  const fullRawData = `${incomingRequest}\n\n\n${forwardedTo}\n\n\n${response}`;


  return (
    <Card className="border border-[var(--muted)] p-6 mt-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-card-foreground text-lg font-semibold">
          Raw HTTP Data
        </h3>
        <CopyButton text={fullRawData} />
      </div>

      <div className="space-y-6">
        <div className="bg-[var(--input)] p-3 rounded-md">
          <h4 className="text-foreground font-medium mb-2 text-sm">
            INCOMING REQUEST
          </h4>
          <div className="relative">
            <CopyButton text={incomingRequest} />
            <pre className="bg-muted p-4 rounded overflow-x-auto border border-[var(--muted)]">
              <code className="text-muted-foreground text-sm whitespace-pre-wrap leading-relaxed">
                {incomingRequest}
              </code>
            </pre>
          </div>
        </div>

        {/* Forwarded To */}
        <div>
          <h4 className="text-foreground font-medium mb-2 text-sm">
            FORWARDED TO
          </h4>
          <div className="relative bg-[var(--input)] p-3 rounded-md">
            <CopyButton text={forwardedTo} />
            <pre className="bg-muted p-4 rounded overflow-x-auto border border-[var(--muted)]">
              <code className="text-muted-foreground text-sm whitespace-pre-wrap leading-relaxed">
                {forwardedTo}
              </code>
            </pre>
          </div>
        </div>

        {/* Response */}
        <div className="bg-[var(--input)] p-3 rounded-md">
          <h4 className="text-foreground font-medium mb-2 text-sm">
            RESPONSE
          </h4>
          <div className="relative">
            <CopyButton text={response} />
            <pre className="bg-muted p-4 rounded overflow-x-auto border border-[var(--muted)]">
              <code className="text-muted-foreground text-sm whitespace-pre-wrap leading-relaxed">
                {response}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </Card>
  );
}