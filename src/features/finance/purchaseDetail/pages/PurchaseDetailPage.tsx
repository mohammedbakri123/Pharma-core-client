import { useNavigate, useParams, Outlet } from "react-router-dom";
import { Card } from "@/ui/card";
import { Button } from "@/ui/button";
import { Spinner } from "@/ui/spinner";
import { Ban } from "lucide-react";
import { useGetPurchase, useGetPurchaseBalance } from "../../common/hooks/usePurchases";
import PurchaseDetailHeader from "../components/PurchaseDetailHeader";
import PurchaseSummaryCards from "../components/PurchaseSummaryCards";
import PurchaseActionsBar from "../components/PurchaseActionsBar";
import TabNav from "@/ui/TabNav";

export default function PurchaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const purchaseId = Number(id);

  const {
    data: purchase,
    isLoading,
    isError,
    refetch,
  } = useGetPurchase(purchaseId);
  const { data: balance } = useGetPurchaseBalance(purchaseId);

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

  if (isError || !purchase) {
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
              onClick={() => navigate("/finance/purchases")}
            >
              العودة إلى المشتريات
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const tabs = [
    { to: `/finance/purchases/${id}/items`, label: "الأصناف" },
    { to: `/finance/purchases/${id}/payments`, label: "المدفوعات" },
    { to: `/finance/purchases/${id}/returns`, label: "المرتجعات" },
  ];

  return (
    <Card className="overflow-hidden dir-rtl">
      <PurchaseDetailHeader
        purchase={purchase}
        onBack={() => navigate("/finance/purchases")}
      />

      <div className="p-6 space-y-4">
        <PurchaseSummaryCards purchase={purchase} balance={balance} />
        <PurchaseActionsBar
          purchaseId={purchase.purchaseId}
          status={purchase.status}
        />
      </div>

      <TabNav tabs={tabs} variant="underline">
        <div className="p-6">
          <Outlet />
        </div>
      </TabNav>
    </Card>
  );
}
