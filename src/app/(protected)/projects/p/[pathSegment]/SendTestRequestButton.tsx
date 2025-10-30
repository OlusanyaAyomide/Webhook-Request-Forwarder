'use client'

import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function SendTestRequestButton({ pathSegment }: { pathSegment: string }) {
  const handleClick = async () => {
    const res = await fetch(`/${pathSegment}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'Hello from forwarder-service!' }),
    })

    const data = await res.json()

    toast.success("Test Request Sent", {
      description: `Status: ${res.status}\nResponse: ${JSON.stringify(data)}`,
    })
  }

  return <Button onClick={handleClick}>Send Test Request</Button>
}
