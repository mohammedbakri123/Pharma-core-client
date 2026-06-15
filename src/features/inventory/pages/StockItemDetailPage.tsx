import { useParams, useNavigate } from "react-router-dom";
import { useGetStockByMedicine } from "../hooks/useInventory";
import { Card, CardContent } from "@/ui/card";
import { Button } from "@/ui/button";
import { Spinner } from "@/ui/spinner";
import { Separator } from "@/ui/separator";
import {
  Package,
  Layers,
  DollarSign,
  XCircle,
  PackageOpen,
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { StockItemHeader } from "../components/StockItemDetail/StockItemHeader";
import { BatchesTable } from "../components/StockItemDetail/BatchesTable";
import { StatCard } from "../components/StockItemDetail/StatCard";

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
        <CardContent className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Spinner size="lg" />
            <p className="text-muted-foreground text-sm">
              جاري تحميل بيانات المخزون...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
          <XCircle className="w-12 h-12 text-destructive" />
          <p className="text-destructive font-medium">
            فشل تحميل بيانات المخزون
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            إعادة المحاولة
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!stock) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
          <PackageOpen className="w-12 h-12 text-muted-foreground" />
          <p className="text-muted-foreground font-medium">لا توجد بيانات</p>
          <Button variant="outline" onClick={() => navigate("/inventory")}>
            العودة إلى المخزون
          </Button>
        </CardContent>
      </Card>
    );
  }

  const batches = stock.batches || [];
  const totalQuantity = batches.reduce((s, b) => s + b.quantityRemaining, 0);
  const totalValue = batches.reduce(
    (s, b) => s + b.quantityRemaining * b.purchasePrice,
    0,
  );

  return (
    <Card className="overflow-hidden">
      <div className="h-1.5 bg-gradient-to-l from-primary via-primary/60 to-primary/20" />

      <StockItemHeader
        medicineName={stock.medicineName}
        medicineId={medicineId}
        totalQuantity={totalQuantity}
        onBack={() => navigate("/inventory")}
      />

      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard
            icon={Package}
            label="الكمية المتبقية"
            value={new Intl.NumberFormat("ar-SA").format(totalQuantity)}
          />
          <StatCard icon={Layers} label="عدد الباتشات" value={batches.length} />
          <StatCard
            icon={DollarSign}
            label="إجمالي قيمة المخزون"
            value={`${formatCurrency(totalValue)} ر.س`}
          />
        </div>

        <Separator />

        <BatchesTable batches={batches} />
      </CardContent>
    </Card>
  );
}
