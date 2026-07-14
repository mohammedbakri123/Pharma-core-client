import { Card, CardContent } from "@/ui/card";

function KpiCardSkeleton() {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="h-11 w-11 shrink-0 animate-pulse rounded-lg bg-muted" />
          <div className="min-w-0 flex-1 text-left">
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-7 w-24 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-3 w-28 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function KpiSummarySkeleton() {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <KpiCardSkeleton />
      <KpiCardSkeleton />
      <KpiCardSkeleton />
      <KpiCardSkeleton />
    </section>
  );
}
