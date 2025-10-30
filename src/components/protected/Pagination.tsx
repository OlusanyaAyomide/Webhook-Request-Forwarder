// components/pagination.tsx
'use client'

import { Button } from "../ui/button";
import { useRouter, usePathname } from 'next/navigation'
import NProgress from 'nprogress'

export default function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter()
  const pathname = usePathname()

  const handlePageChange = (page: number) => {
    NProgress.start()
    const url = `${pathname}?page=${page}`
    router.push(url, { scroll: false })
  }

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
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}