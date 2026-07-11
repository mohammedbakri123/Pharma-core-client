import { Link } from "react-router-dom";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { cn } from "@/utils/utils";
import type { PaymentOverviewItem } from "@features/finance/common/types/payment";
import { formatAmount, formatTime } from "../utils/dashboard-formatters";
import { EmptyActivity } from "./EmptyActivity";

export function RecentPayments({ payments }: { payments: PaymentOverviewItem[] }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>آخر المدفوعات</CardTitle>
        <Button asChild variant="outline" size="sm">
          <Link to="/finance/payments">عرض الكل</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {payments.length === 0 ? (
          <EmptyActivity text="لا توجد حركات نقدية في الفترة المحددة" />
        ) : (
          payments.map((payment) => (
            <div
              key={payment.paymentId}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <p className="font-semibold">{payment.referenceLabel}</p>
                <p className="text-xs text-muted-foreground">
                  {payment.partyName || payment.userName || "بدون طرف"} ·{" "}
                  {formatTime(payment.createdAt)}
                </p>
              </div>
              <div className="text-left">
                <strong
                  className={cn(
                    "tabular-nums",
                    payment.type === "incoming"
                      ? "text-emerald-600"
                      : "text-rose-600",
                  )}
                  dir="ltr"
                >
                  {payment.type === "incoming" ? "+" : "-"}
                  {formatAmount(payment.amount)}
                </strong>
                <p className="text-xs text-muted-foreground">
                  {payment.method === "card" ? "بطاقة" : "نقداً"}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
