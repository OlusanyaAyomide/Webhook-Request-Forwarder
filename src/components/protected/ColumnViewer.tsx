
'use client'

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function ColumnViewer({ headers }: { headers: Record<string, string> }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        className="px-2 relative flex ml-auto bottom-[42px] mr-2"
        onClick={() => { setIsOpen((prev => !prev)) }}
      >
        <ChevronDown className={`transion-all duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`} />
      </button>
      <div
        className={`space-y-2 rounded-md p-2 md:p-3 bg-[var(--input)] transition-all duration-300 overflow-hidden ${isOpen ? "h-16" : "h-auto"}`}>
        {Object.entries(headers).map(([key, value]) => (
          <div key={key} className="grid grid-cols-4 gap-4 p-3 bg-muted rounded">
            <code className="text-primary">{key}</code>
            <code className="col-span-3 text-foreground break-all">{value}</code>
          </div>
        ))}
      </div>
    </>
  );
}
