import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { cn } from "@/utils/utils";
import { SearchX } from "lucide-react";
import { Spinner } from "./spinner";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  cell?: (item: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  emptyMessage?: string;
  emptySearchMessage?: string;
  searchQuery?: string;
  containerClassName?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading,
  isError,
  errorMessage = "فشل تحميل البيانات",
  onRetry,
  emptyMessage = "لا توجد بيانات",
  emptySearchMessage = "لا توجد نتائج مطابقة لبحثك",
  searchQuery,
  containerClassName,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="py-10 text-center flex flex-col items-center justify-center gap-2">
        <Spinner size={"lg"} />
        <span className="text-sm text-muted-foreground">جاري التحميل...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-10 text-center text-destructive flex flex-col items-center justify-center gap-2 border border-destructive/20 rounded-lg bg-destructive/5">
        <SearchX className="w-8 h-8 text-destructive" />
        <span className="font-semibold text-sm">{errorMessage}</span>
        <span className="text-xs text-muted-foreground">
          يرجى التأكد من تشغيل الخادم والمحاولة مرة أخرى.
        </span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-xs underline underline-offset-2 hover:text-destructive/80"
          >
            إعادة المحاولة
          </button>
        )}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="py-10 text-center text-muted-foreground flex flex-col items-center justify-center gap-2 border border-dashed border-border rounded-lg bg-muted/10">
        <SearchX className="w-8 h-8 text-muted-foreground/55" />
        <span className="text-sm font-medium">{emptyMessage}</span>
        {searchQuery && (
          <span className="text-xs">
            {emptySearchMessage}: "{searchQuery}"
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn("overflow-x-auto", containerClassName)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={cn("text-right font-semibold", col.headerClassName)}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={keyExtractor(item)}>
              {columns.map((col) => (
                <TableCell key={col.key} className={col.className}>
                  {col.render
                    ? col.render(item, index)
                    : col.cell
                      ? col.cell(item, index)
                      : ((item as any)[col.key] ?? "-")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
