import { Link } from "react-router-dom";

import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import type { SaleDto } from "@features/finance/common/types/sale";
import { formatAmount, formatTime } from "../utils/dashboard-formatters";
import { EmptyActivity } from "./EmptyActivity";

export function RecentSalesPanel({ sales }: { sales: SaleDto[] }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>آخر المبيعات</CardTitle>
        <Button asChild variant="outline" size="sm">
          <Link to="/finance/sales">عرض الكل</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {sales.length === 0 ? (
          <EmptyActivity text="لا توجد مبيعات مكتملة بعد" />
        ) : (
          sales.map((sale) => (
            <Link
              key={sale.saleId}
              to={`/finance/sales/${sale.saleId}`}
              className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div>
                <p className="font-semibold">فاتورة #{sale.saleId}</p>
                <p className="text-xs text-muted-foreground">
                  {sale.customerName || "عميل نقدي"} ·{" "}
                  {formatTime(sale.createdAt)}
                </p>
              </div>
              <strong className="tabular-nums" dir="ltr">
                {formatAmount(sale.totalAmount - sale.discount)}
              </strong>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
