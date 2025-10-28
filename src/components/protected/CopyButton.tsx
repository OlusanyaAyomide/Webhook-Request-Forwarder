import { toast } from "sonner";

export function CopyButton
  ({ text, customMessage }: { text: string, customMessage?: string }

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
      onClick={handleCopy}
      className="absolute top-2 right-2 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
    >
      Copy
    </button>
  );
}
