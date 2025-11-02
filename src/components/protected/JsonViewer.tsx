'use client'


export default function JsonViewer({ json, addMaxWidth }: { json: object, addMaxWidth?: boolean }) {
  const jsonString = JSON.stringify(json, null, 2);
  return (
    <div className="relative rounded-md p-3 bg-[var(--input)]">
      <pre className={`bg-muted p-4 rounded overflow-x-auto  w-full ${addMaxWidth && "max-lg:max-w-[85vw] lg:max-w-[776px]"} whitespace-pre`}>
        <code className="text-muted-foreground text-sm">{jsonString}</code>
      </pre>
    </div>
  );
}
