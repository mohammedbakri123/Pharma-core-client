import { useParams } from "react-router-dom";
import { useGetStockByMedicine } from "../../hooks/useInventory";
import { Package, Layers, DollarSign, SaudiRiyal } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { StatCard } from "./StatCard";
import { Spinner } from "@/ui/spinner";

export default function StockItemOverview() {
  const { id } = useParams<{ id: string }>();
  const medicineId = Number(id);
  const { data: stock, isLoading } = useGetStockByMedicine(medicineId);

  if (isLoading || !stock) {
    return (
      <div className="flex justify-center py-10">
        <Spinner size="lg" />
      </div>
    );
  }

  const batches = stock.batches || [];
  const totalQuantity = batches.reduce((s, b) => s + b.quantityRemaining, 0);
  const totalValue = batches.reduce(
    (s, b) => s + b.quantityRemaining * b.purchasePrice,
    0,
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
      <StatCard
        icon={Package}
        label="الكمية المتبقية"
        value={new Intl.NumberFormat("ar-SA").format(totalQuantity)}
      />
      <StatCard
        icon={Layers}
        label="عدد الباتشات"
        value={batches.length}
      />
      <StatCard
        icon={DollarSign}
        label="إجمالي قيمة المخزون"
        value={
          <span className="flex items-center gap-1">
            {formatCurrency(totalValue)}
            <SaudiRiyal className="w-4 h-4" />
          </span>
        }
      />
    </div>
  );
}
