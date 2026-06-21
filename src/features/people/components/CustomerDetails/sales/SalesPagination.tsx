import { Button } from "@/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SalesPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function SalesPagination({
  page,
  totalPages,
  total,
  onPageChange,
}: SalesPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-4 py-2 border-t border-border/50 text-xs">
      <div className="text-muted-foreground">
        {total} فاتورة - صفحة {page} من {totalPages}
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 cursor-pointer"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
          if (totalPages > 5 && Math.abs(p - page) > 1 && p !== 1 && p !== totalPages) {
            if (p === 2 || p === totalPages - 1) {
              return <span key={p} className="px-1 text-muted-foreground">...</span>;
            }
            return null;
          }
          return (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              className="h-8 w-8 text-xs cursor-pointer"
              onClick={() => onPageChange(p)}
            >
              {p}
            </Button>
          );
        })}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 cursor-pointer"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
