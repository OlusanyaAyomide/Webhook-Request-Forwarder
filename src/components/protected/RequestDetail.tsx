"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

import { CopyButton } from "@/components/protected/CopyButton";
import RequestSummary, { getStatusBadge } from "@/components/protected/RequestSummary";
import ColumnViewer from "@/components/protected/ColumnViewer";
import JsonViewer from "@/components/protected/JsonViewer";
import { RawView } from "@/components/protected/RawView";
import RetryDialog from "@/components/protected/RetryDiaog";
import ViewModeToggle from "@/components/protected/ViewModeToggle";
import { RequestLog } from "@prisma/client";



export default function RequestDetailPage({ log }: { log: RequestLog }) {

  const [retryDialogOpen, setRetryDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"formatted" | "raw">("formatted")

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span />
          <Button
            onClick={() => setRetryDialogOpen(true)}
            variant="outline"
            className="border-border"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Webhook
          </Button>
        </div>
        <h1 className="text-foreground text-2xl font-bold mb-2">
          Request Details
        </h1>
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground">{log.id}</p>
          <CopyButton
            text={log.id}
            customMessage="Request ID copied to clipboard"
          />
        </div>
      </div>

      <RequestSummary log={log} />

      <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />

      {viewMode === "formatted" ? (
        <Tabs defaultValue="incoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="incoming">
              Incoming Request
            </TabsTrigger>
            <TabsTrigger value="outgoing">
              Outgoing Request
            </TabsTrigger>
            <TabsTrigger value="response">
              Response
            </TabsTrigger>
          </TabsList>

          <TabsContent value="incoming">
            <Card className="hover:scale-100 p-2 md:p-6">
              <h3 className="text-card-foreground text-lg font-semibold mb-4">
                Incoming Headers
              </h3>
              <ColumnViewer headers={log.requestHeaders as Record<string, string>} />
            </Card>

            <Card className="hover:scale-100 mt-14 p-2 md:p-6">
              <h3 className="text-card-foreground text-lg font-semibold mb-4">
                Incoming Body
              </h3>
              <JsonViewer json={log.requestBody as Record<string, string>} />
            </Card>
          </TabsContent>

          <TabsContent value="outgoing">
            <Card className="hover:scale-100 mt-14 p-2 md:p-6">
              <h3 className="text-card-foreground text-lg font-semibold mb-4">
                Outgoing URL
              </h3>
              <div className="flex items-start gap-2">
                <code className="text-foreground bg-muted p-3 rounded block flex-1 break-all">
                  {log.forwardedUrl || "N/A"}
                </code>
                <CopyButton
                  text={log.forwardedUrl || ""}
                  customMessage="URL copied to clipboard"
                />
              </div>
            </Card>

            <Card className="mt-10 p-3 md:p-6 hover:scale-100">
              <h3 className="text-card-foreground text-lg font-semibold mb-4">
                Full Incoming URL
              </h3>
              <div className="flex items-start gap-2">
                <code className="text-foreground bg-muted p-3 rounded block flex-1 break-all">
                  {log.fullIncomingUrl || "N/A"}
                </code>
                <CopyButton
                  text={log.fullIncomingUrl || ""}
                  customMessage="URL copied to clipboard"

                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="response">
            <Card className="mt-10 p-3 md:p-6 hover:scale-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-card-foreground text-lg font-semibold">
                  Response Status
                </h3>
                <div>
                  {getStatusBadge(log.responseStatus || 0)}
                  <span className="ml-4 font-medium text-base">{log.responseStatus}</span>
                </div>
              </div>
            </Card>

            <Card className="mt-10 p-3 md:p-6 hover:scale-100">
              <h3 className="text-card-foreground text-lg font-semibold mb-4">
                Response Headers
              </h3>
              <ColumnViewer headers={log.responseHeaders as Record<string, string>} />
            </Card>

            <Card className="mt-10 p-3 md:p-6 hover:scale-100">
              <h3 className="text-card-foreground text-lg font-semibold mb-4">
                Response Body
              </h3>
              <JsonViewer json={log.responseBody as Record<string, string>} />
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <RawView log={log} />
      )}

      <RetryDialog
        open={retryDialogOpen}
        onOpenChange={setRetryDialogOpen}
        log={log}
      />
    </div>
  );
}