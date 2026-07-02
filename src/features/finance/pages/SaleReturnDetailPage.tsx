import { useParams, useNavigate, Outlet } from "react-router-dom";
import { XCircle } from "lucide-react";
import { Card } from "@/ui/card";
import { Button } from "@/ui/button";
import { Spinner } from "@/ui/spinner";

import {
  useSaleReturnById,
  useGetSaleReturnBalance,
} from "../hooks/useSalesReturns";
import { useGetSale } from "../hooks/useSales";

import SalesReturnHeader from "../components/Sales/SaleDetail/returns/SalesReturnDetail/SalesReturnHeader";
import SalesReturnNote from "../components/Sales/SaleDetail/returns/SalesReturnDetail/SalesReturnNote";
import SalesReturnSummaryCards from "../components/Sales/SaleDetail/returns/SalesReturnDetail/SalesReturnSummaryCards";
import TabNav from "@/ui/TabNav";

//TODO: this file need a shit refactoring
export default function SaleReturnDetailPage() {
  const { id, returnId } = useParams<{ id: string; returnId: string }>();
  const saleId = Number(id);
  const retId = Number(returnId);

  const navigate = useNavigate();

  // State for dialogs

  // Queries
  const {
    data: salesReturn,
    isLoading: returnLoading,
    isError: returnError,
    refetch: refetchReturn,
  } = useSaleReturnById(saleId, retId);

  const { data: sale, isLoading: saleLoading } = useGetSale(saleId);
  const { data: balance, isLoading: balanceLoading } = useGetSaleReturnBalance(
    saleId,
    retId,
  );

  const isLoading = returnLoading || saleLoading || balanceLoading;
  const isError = returnError || !salesReturn || !sale;

  const tabs = [
    { to: `/finance/sales/${id}/returns/${returnId}/items`, label: "الأصناف" },
    {
      to: `/finance/sales/${id}/returns/${returnId}/payments`,
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
              onClick={() => navigate(`/finance/sales/${saleId}/returns`)}
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
      {/* Return Header */}
      <SalesReturnHeader
        salesReturn={salesReturn}
        onBack={() => navigate(`/finance/sales/${saleId}/returns`)}
      />

      <div className="p-6 space-y-6">
        {/* Return note description if exists */}
        {salesReturn.note && <SalesReturnNote note={salesReturn.note} />}
        {/* Summary Cards */}
        <SalesReturnSummaryCards balance={balance} salesReturn={salesReturn} />
      </div>
      <TabNav tabs={tabs} variant="underline">
        <div className="p-6">
          <Outlet />
        </div>
      </TabNav>
    </Card>
  );
}
