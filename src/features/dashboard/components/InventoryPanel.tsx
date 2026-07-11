import { Link } from "react-router-dom";

import { Badge } from "@/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { formatDate } from "@/utils/formatters";
import type { StockAlertDto } from "@features/inventory/types/inventory";

interface InventoryPanelProps {
  title: string;
  count: number;
  items: StockAlertDto[];
  emptyText: string;
}

export function InventoryPanel({
  title,
  count,
  items,
  emptyText,
}: InventoryPanelProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>{title}</CardTitle>
        <Badge variant={count > 0 ? "destructive" : "secondary"}>{count}</Badge>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
            {emptyText}
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <Link
                key={`${title}-${item.medicineId}`}
                to={`/inventory/stock/${item.medicineId}`}
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold">
                    {item.arabicName || item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.categoryName || "بدون فئة"}
                  </p>
                </div>
                <div className="text-left">
                  <p className="font-bold tabular-nums">{item.totalQuantity}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.nearestExpireDate
                      ? formatDate(item.nearestExpireDate)
                      : "-"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
