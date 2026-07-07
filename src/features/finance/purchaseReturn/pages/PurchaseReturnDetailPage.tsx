import { useParams, useNavigate, Outlet } from "react-router-dom";
import { XCircle } from "lucide-react";
import { Card } from "@/ui/card";
import { Button } from "@/ui/button";
import { Spinner } from "@/ui/spinner";

import {
  usePurchaseReturnById,
  usePurchaseReturnBalance,
} from "../../common/hooks/usePurchaseReturns";
import { useGetPurchase } from "../../common/hooks/usePurchases";

import PurchaseReturnHeader from "../components/PurchaseReturnHeader";
import PurchaseReturnNote from "../components/PurchaseReturnNote";
import PurchaseReturnSummaryCards from "../components/PurchaseReturnSummaryCards";
import TabNav from "@/ui/TabNav";

export default function PurchaseReturnDetailPage() {
  const { id, returnId } = useParams<{ id: string; returnId: string }>();
  const purchaseId = Number(id);
  const retId = Number(returnId);

  const navigate = useNavigate();

  const {
    data: purchaseReturn,
    isLoading: returnLoading,
    isError: returnError,
    refetch: refetchReturn,
  } = usePurchaseReturnById(purchaseId, retId);

  const { data: purchase, isLoading: purchaseLoading } = useGetPurchase(purchaseId);
  const { data: balance, isLoading: balanceLoading } = usePurchaseReturnBalance(
    purchaseId,
    retId,
  );

  const isLoading = returnLoading || purchaseLoading || balanceLoading;
  const isError = returnError || !purchaseReturn || !purchase;

  const tabs = [
    { to: `/finance/purchases/${id}/returns/${returnId}/items`, label: "الأصناف" },
    {
      to: `/finance/purchases/${id}/returns/${returnId}/payments`,
      label: "المدفوعات",
    },
  ];

  if (isLoading) {
    return (
      <Card className="dir-rtl">
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Spinner size="lg" />
          <p className="text-muted-foreground text-sm">
            جاري تحميل تفاصيل المرتجع...
          </p>
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="dir-rtl">
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <XCircle className="w-12 h-12 text-destructive" />
          <p className="text-destructive font-medium">
            فشل تحميل بيانات المرتجع
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetchReturn()}>
              إعادة المحاولة
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate(`/finance/purchases/${purchaseId}/returns`)}
            >
              العودة لقائمة المرتجعات
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden dir-rtl">
      <PurchaseReturnHeader
        purchaseReturn={purchaseReturn}
        onBack={() => navigate(`/finance/purchases/${purchaseId}/returns`)}
      />

      <div className="p-6 space-y-6">
        {purchaseReturn.note && <PurchaseReturnNote note={purchaseReturn.note} />}
        <PurchaseReturnSummaryCards balance={balance} purchaseReturn={purchaseReturn} />
      </div>
      <TabNav tabs={tabs} variant="underline">
        <div className="p-6">
          <Outlet />
        </div>
      </TabNav>
    </Card>
  );
}
