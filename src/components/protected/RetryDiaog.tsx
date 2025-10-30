"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "../ui/card";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { getStatusBadge } from "./RequestSummary";
import HeadersViewer from "./ColumnViewer";
import JsonViewer from "./JsonViewer";
import { RequestLog } from "@prisma/client";
import { Badge } from "../ui/badge";
import { retryWebhook } from "@/app/(protected)/projects/new/actions";


interface RetryResult {
  status: number;
  headers: Record<string, string>;
  body: object;
  duration: number;
}

export default function RetryDialog({
  open,
  onOpenChange,
  log,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  log: RequestLog;
}) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryResult, setRetryResult] = useState<RetryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRetry = async () => {
    setIsRetrying(true);
    setError(null);
    setRetryResult(null);

    try {
      const result = await retryWebhook({
        url: log.forwardedUrl || "",
        method: log.method,
        headers: log.requestHeaders as Record<string, string>,
        body: log.requestBody,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to retry webhook");
      }

      setRetryResult({
        status: result.status!,
        headers: result.headers!,
        body: result.body as object,
        duration: result.duration!,
      });

      toast.success("Webhook retry completed");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to retry webhook";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Retry Webhook</DialogTitle>
          <DialogDescription>
            Re-send this webhook request to the original destination
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Original Request Info */}
          <Card className="bg-card border-border p-4 mt-10">
            <h4 className="text-sm font-semibold text-card-foreground mb-2">
              Original Request
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex gap-2">
                <span className="text-muted-foreground">Method:</span>
                <Badge className="border border-[var(--muted)]">
                  {log.method}
                </Badge>
              </div>
              <div className="flex max-md:flex-col items-center gap-2">
                <span className="text-muted-foreground">URL:</span>
                <code className="text-xs text-foreground break-all">
                  {log.forwardedUrl}
                </code>
              </div>
            </div>
          </Card>

          <Button
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full flex text-white h-10 md:h-12 mt-5"
          >
            {isRetrying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Webhook
              </>
            )}
          </Button>

          {error && (
            <Card className="bg-destructive/10 border-destructive p-4">
              <p className="text-destructive text-sm">{error}</p>
            </Card>
          )}

          {retryResult && (
            <div className="space-y-4">
              <Card className="bg-card border-border p-4 mt-10">
                <h4 className="text-sm font-semibold text-card-foreground mb-3">
                  Retry Result
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">
                      Status:{" "}
                      <span className="font-medium">{retryResult.status}</span>
                    </p>
                    {getStatusBadge(retryResult.status)}
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">
                      Duration (Server)
                    </p>
                    <p className="text-foreground text-sm">
                      {retryResult.duration}ms
                    </p>
                    <p className="text-muted-foreground text-xs mt-1">
                      Measured on server
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-card border-border p-4 mt-10">
                <h4 className="text-sm font-semibold text-card-foreground mb-3">
                  Response Headers
                </h4>
                <HeadersViewer headers={retryResult.headers} />
              </Card>

              <Card className="bg-card border-border p-4 mt-10">
                <h4 className="text-sm font-semibold text-card-foreground mb-3">
                  Response Body
                </h4>
                <JsonViewer json={retryResult.body} id="retry-response" />
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}