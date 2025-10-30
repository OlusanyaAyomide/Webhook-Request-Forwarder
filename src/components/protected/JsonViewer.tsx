'use client'


export default function JsonViewer({ json, id }: { json: object; id: string }) {
  const jsonString = JSON.stringify(json, null, 2);
  return (
    <div className="relative rounded-md p-3 bg-[var(--input)]">
      <pre className="bg-muted p-4 rounded overflow-x-auto  w-full max-lg:max-w-[80vw] lg:max-w-[720px] whitespace-pre">
        <code className="text-muted-foreground text-sm">{jsonString}</code>
      </pre>
    </div>
  );
}
