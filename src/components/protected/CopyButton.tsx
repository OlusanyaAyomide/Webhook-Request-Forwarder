'use client'

import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export function CopyButton
  ({ text, customMessage, className }:
    { text: string, customMessage?: string, className?: string }

  ) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(customMessage || "Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy");
      console.error("Clipboard copy failed:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition",
        className
      )
      }
    >
      <Copy className="w-4 h-4" />
    </button>
  );
}
