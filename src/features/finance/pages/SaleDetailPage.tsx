import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSale } from "../api/sales";
import { Card } from "@/ui/card";
import { Button } from "@/ui/button";
import { Spinner } from "@/ui/spinner";
import { Ban, ArrowRight, Coins, ShoppingCart, CreditCard, RotateCcw } from "lucide-react";

export default function SaleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const saleId = Number(id);

  const {
    data: sale,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["sale", saleId],
    queryFn: async () => {
      const response = await getSale(saleId);
      return response.data;
    },
    enabled: !!saleId,
  });

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Spinner size="lg" />
            <p className="text-muted-foreground text-sm">
              جاري تحميل بيانات الفاتورة...
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (isError || !sale) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Ban className="w-12 h-12 text-destructive" />
          <p className="text-destructive font-medium">فشل تحميل بيانات الفاتورة</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              إعادة المحاولة
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate("/finance")}
            >
              العودة إلى المبيعات
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-border/40 bg-card">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/finance")}
            className="gap-1"
          >
            <ArrowRight className="w-4 h-4" />
            العودة
          </Button>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Coins className="w-5 h-5 text-primary" />
            فاتورة مبيعات #{sale.saleId}
          </h2>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Sale summary section — already implemented */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-muted/30 border border-border/40">
            <p className="text-sm text-muted-foreground">الإجمالي</p>
            <p className="text-xl font-bold">{sale.totalAmount.toLocaleString()} ريال</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/30 border border-border/40">
            <p className="text-sm text-muted-foreground">الخصم</p>
            <p className="text-xl font-bold">{sale.discount > 0 ? `${sale.discount.toLocaleString()} ريال` : "-"}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/30 border border-border/40">
            <p className="text-sm text-muted-foreground">تاريخ الفاتورة</p>
            <p className="text-xl font-bold">{new Date(sale.createdAt).toLocaleDateString("ar-SA")}</p>
          </div>
        </div>

        {/* Placeholder action cards for future implementation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-dashed border-border/60 bg-muted/10">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">إدارة الأصناف</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              إضافة وتعديل وحذف أصناف الفاتورة
            </p>
          </div>

          <div className="p-4 rounded-lg border border-dashed border-border/60 bg-muted/10">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">إتمام الدفع</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              إتمام الفاتورة وتسديد المدفوعات
            </p>
          </div>

          <div className="p-4 rounded-lg border border-dashed border-border/60 bg-muted/10">
            <div className="flex items-center gap-2 mb-2">
              <RotateCcw className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">المرتجعات</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              إدارة مرتجعات المبيعات
            </p>
          </div>
        </div>

        {/* Items table placeholder */}
        <div className="rounded-lg border border-border/40 overflow-hidden">
          <div className="p-3 bg-muted/20 border-b border-border/40">
            <h3 className="font-semibold text-sm">أصناف الفاتورة</h3>
          </div>
          <div className="p-8 text-center text-muted-foreground text-sm">
            قائمة الأصناف — سيتم تفعيلها لاحقًا
          </div>
        </div>
      </div>
    </Card>
  );
}
