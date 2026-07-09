import { useParams, useNavigate, Outlet } from "react-router-dom";
import { useMedicine } from "../hooks/useMedicine";
import { useGetStockByMedicine } from "../hooks/useInventory";
import { Card } from "@/ui/card";
import { Button } from "@/ui/button";
import { Spinner } from "@/ui/spinner";
import { Ban } from "lucide-react";
import { MedicineDetailHeader } from "../components/MedicineDetail/MedicineDetailHeader";
import TabNav from "@/ui/TabNav";

export default function MedicineDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const medicineId = Number(id);

  const {
    data: medicine,
    isLoading,
    isError,
    refetch,
  } = useMedicine(medicineId);

  const { data: stock } = useGetStockByMedicine(medicineId);
  const batches = stock?.batches || [];
  const totalQuantity = batches.reduce((s, b) => s + b.quantityRemaining, 0);

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Spinner size="lg" />
            <p className="text-muted-foreground text-sm">
              جاري تحميل بيانات الصنف...
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (isError || !medicine) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Ban className="w-12 h-12 text-destructive" />
          <p className="text-destructive font-medium">فشل تحميل بيانات الصنف</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              إعادة المحاولة
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate("/inventory/medicines")}
            >
              العودة إلى الأصناف
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const tabs = [
    { to: `/inventory/medicines/${id}/overview`, label: "نظرة عامة" },
    { to: `/inventory/medicines/${id}/batches`, label: `الباتشات (${batches.length})` },
    { to: `/inventory/medicines/${id}/movements`, label: "حركات المخزون" },
  ];

  return (
    <Card className="overflow-hidden dir-rtl">
      <MedicineDetailHeader
        medicine={medicine}
        totalStock={totalQuantity}
        onBack={() => navigate("/inventory/medicines")}
      />

      <TabNav tabs={tabs} variant="underline">
        <div className="p-6">
          <Outlet />
        </div>
      </TabNav>
    </Card>
  );
}