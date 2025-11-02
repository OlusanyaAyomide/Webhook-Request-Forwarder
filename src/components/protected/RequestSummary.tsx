'use client'

import { RequestLog } from "@prisma/client";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import LocalTime from "./LocalTime";



export const getStatusBadge = (status: number) => {
  if (status >= 200 && status < 300) {
    return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Success</Badge>;
  } else if (status >= 400 && status < 500) {
    return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Client Error</Badge>;
  } else if (status >= 500) {
    return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Server Error</Badge>;
  }
  return <Badge variant="outline">{status}</Badge>;
};

export default function RequestSummary({ log }: { log: RequestLog }) {
  const event = log.incomingPath?.split("/")[1] || "webhook";


  return (
    <Card className="p-6 border border-[var(--muted)]">
      <h3 className="text-card-foreground text-lg font-semibold mb-4">Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <p className="text-muted-foreground mb-1">Method</p>
          <Badge variant="outline" className="border-border">
            {log.method}
          </Badge>
        </div>
        <div>
          <p className="text-muted-foreground mb-1">Path</p>
          <code className="text-foreground">{log.incomingPath}</code>
        </div>
        <div>
          <p className="text-muted-foreground mb-1">Event</p>
          <code className="text-foreground">{event}</code>
        </div>
        <div>
          <p className="text-muted-foreground mb-1">Timestamp</p>
          <LocalTime dateString={log.createdAt} />
        </div>
        <div>
          <p className="text-muted-foreground mb-1">Duration</p>
          <p className="text-foreground">{log.durationMs || "N/A"}ms</p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1">Status</p>
          {getStatusBadge(log.responseStatus || 0)}
        </div>
      </div>
    </Card>
  );
}