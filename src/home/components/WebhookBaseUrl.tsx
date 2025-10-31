'use client'

import { CopyButton } from "@/components/protected/CopyButton";
import { useEffect, useState } from "react";

export default function WebhookBaseUrl({ pathSegment }: { pathSegment: string }) {

  const [baseUrl, setBaseUrl] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const incomingUrl = `${baseUrl}/${pathSegment}`
  return (
    <div className="flex items-center gap-2">
      <code className="flex-1 text-sm bg-muted px-3 py-2 rounded overflow-x-auto font-mono">
        {incomingUrl}
      </code>
      <CopyButton
        text={incomingUrl}
        customMessage="Incoming Url Copied to clipboard"
      />
    </div>
  )
}
