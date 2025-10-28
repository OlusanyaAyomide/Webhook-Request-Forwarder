
import Link from "next/link";
import { Button } from "../ui/button";

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl
}: {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}) {
  return (
    <div className="flex items-center justify-between px-2 py-4 border-t">
      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          asChild={currentPage > 1}
        >
          {currentPage > 1 ? (
            <Link href={`${baseUrl}?page=${currentPage - 1}`}>Previous</Link>
          ) : (
            <span className="opacity-70">Previous</span>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          asChild={currentPage < totalPages}
        >
          {currentPage < totalPages ? (
            <Link href={`${baseUrl}?page=${currentPage + 1}`}>Next</Link>
          ) : (
            <span>Next</span>
          )}
        </Button>
      </div>
    </div>
  );
}