import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "./button";
import { cn } from "@/utils/utils";
import { useSearchParams } from "react-router-dom";

interface PaginationProps {
  total: number;
  limit: number;
}

export function Pagination({ total, limit }: PaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");

  const totalPages = Math.max(1, Math.ceil(total / limit));

  if (totalPages <= 1) return null;

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);

    params.set("page", String(Math.min(Math.max(newPage, 1), totalPages)));

    setSearchParams(params);
  };

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const delta = 1;

    const rangeStart = Math.max(2, page - delta);
    const rangeEnd = Math.min(totalPages - 1, page + delta);

    pages.push(1);

    if (rangeStart > 2) {
      pages.push("ellipsis");
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (rangeEnd < totalPages - 1) {
      pages.push("ellipsis");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="text-xs text-muted-foreground">
        {total} نتيجة - صفحة {page} من {totalPages}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => changePage(1)}
          disabled={page <= 1}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => changePage(page - 1)}
          disabled={page <= 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {getPageNumbers().map((p, idx) =>
          p === "ellipsis" ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-1 text-muted-foreground text-xs"
            >
              ...
            </span>
          ) : (
            <Button
              key={p}
              variant={p === page ? "default" : "ghost"}
              size="icon"
              className={cn(
                "h-8 w-8 text-xs",
                p === page && "pointer-events-none",
              )}
              onClick={() => changePage(p)}
            >
              {p}
            </Button>
          ),
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => changePage(page + 1)}
          disabled={page >= totalPages}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => changePage(totalPages)}
          disabled={page >= totalPages}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
