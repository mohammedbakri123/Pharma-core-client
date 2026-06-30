import { useParams, useNavigate, Outlet } from "react-router-dom";
import { Card } from "@/ui/card";
import { Button } from "@/ui/button";
import { Spinner } from "@/ui/spinner";
import { Ban } from "lucide-react";
import { useGetSale, useGetSaleBalance } from "../hooks/useSales";
import SaleDetailHeader from "../components/Sales/SaleDetail/SaleDetailHeader";
import SaleSummaryCards from "../components/Sales/SaleDetail/SaleSummaryCards";
import SaleActionsBar from "../components/Sales/SaleDetail/SaleActionsBar";
import TabNav from "@/ui/TabNav";

export default function SaleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const saleId = Number(id);

  const { data: sale, isLoading, isError, refetch } = useGetSale(saleId);
  const { data: balance } = useGetSaleBalance(saleId);

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
          <p className="text-destructive font-medium">
            فشل تحميل بيانات الفاتورة
          </p>
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

  const tabs = [
    { to: `/finance/sales/${id}/items`, label: "الأصناف" },
    { to: `/finance/sales/${id}/payments`, label: "المدفوعات" },
    { to: `/finance/sales/${id}/returns`, label: "المرتجعات" },
  ];

  return (
    <Card className="overflow-hidden dir-rtl">
      <SaleDetailHeader sale={sale} onBack={() => navigate("/finance/sales")} />

      <div className="p-6 space-y-4">
        <SaleSummaryCards sale={sale} balance={balance} />
        <SaleActionsBar saleId={sale.saleId} status={sale.status} />
      </div>

      <TabNav tabs={tabs} variant="underline">
        <div className="p-6">
          <Outlet />
        </div>
      </TabNav>
    </Card>
  );
}
