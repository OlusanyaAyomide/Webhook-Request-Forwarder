'use client'

import { CopyButton } from "./CopyButton";

export default function JsonViewer({ json, id }: { json: object; id: string }) {
  const jsonString = JSON.stringify(json, null, 2);
  return (
    <div className="relative rounded-md p-3 bg-[var(--input)]">
      <CopyButton text={jsonString} />
      <pre className="bg-muted p-4 rounded overflow-x-auto">
        <code className="text-muted-foreground text-sm">{jsonString}</code>
      </pre>
    </div>
  );
}
