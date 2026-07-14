import { useParams, useNavigate, Outlet } from "react-router-dom";
import { useGetStockByMedicine } from "../hooks/useInventory";
import { Card } from "@/ui/card";
import { Button } from "@/ui/button";
import { Spinner } from "@/ui/spinner";
import { Ban } from "lucide-react";
import { StockItemHeader } from "../components/StockItemDetail/StockItemHeader";
import TabNav from "@/ui/TabNav";

export default function StockItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const medicineId = Number(id);

  const {
    data: stock,
    isLoading,
    isError,
    refetch,
  } = useGetStockByMedicine(medicineId);

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Spinner size="lg" />
            <p className="text-muted-foreground text-sm">
              جاري تحميل بيانات المخزون...
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (isError || !stock) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Ban className="w-12 h-12 text-destructive" />
          <p className="text-destructive font-medium">فشل تحميل بيانات المخزون</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              إعادة المحاولة
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate("/inventory/stock")}
            >
              العودة إلى المخزون
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const batches = stock.batches || [];
  const totalQuantity = batches.reduce((s, b) => s + b.quantityRemaining, 0);

  const tabs = [
    { to: `/inventory/stock/${id}/overview`, label: "نظرة عامة" },
    { to: `/inventory/stock/${id}/batches`, label: `الباتشات (${batches.length})` },
  ];

  return (
    <Card className="overflow-hidden dir-rtl">
      <StockItemHeader
        medicineName={stock.medicineName}
        medicineId={medicineId}
        totalQuantity={totalQuantity}
        onBack={() => navigate("/inventory")}
      />

      <TabNav tabs={tabs} variant="underline">
        <div className="p-6">
          <Outlet />
        </div>
      </TabNav>
    </Card>
  );
}
