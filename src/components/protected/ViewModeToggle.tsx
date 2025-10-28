import { Button } from "../ui/button";

export default function ViewModeToggle({
  viewMode,
  setViewMode,
}: {
  viewMode: "formatted" | "raw";
  setViewMode: (mode: "formatted" | "raw") => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant={viewMode === "formatted" ? "default" : "outline"}
        onClick={() => setViewMode("formatted")}
        className={`px-8 ${viewMode === "formatted" ? "text-white" : "border-border"}`}
      >
        Formatted
      </Button>
      <Button
        size="sm"
        variant={viewMode === "raw" ? "default" : "outline"}
        onClick={() => setViewMode("raw")}
        className={`px-10 ${viewMode === "raw" ? "text-white" : "border-border"}`}
      >
        Raw
      </Button>
    </div>
  );
}
