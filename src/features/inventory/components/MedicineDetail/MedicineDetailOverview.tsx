import { useParams } from "react-router-dom";
import { useGetStockByMedicine } from "../../hooks/useInventory";
import { useMedicine } from "../../hooks/useMedicine";
import { Package, Layers, DollarSign, SaudiRiyal } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { Spinner } from "@/ui/spinner";
import { StatCard } from "../StockItemDetail/StatCard";
import MedicineUnitBadge from "../Medicine/MedicineUnitBadge";

export default function MedicineDetailOverview() {
  const { id } = useParams<{ id: string }>();
  const medicineId = Number(id);

  const { data: medicine, isLoading: loadingMedicine } = useMedicine(medicineId);
  const { data: stock, isLoading: loadingStock } = useGetStockByMedicine(medicineId);

  if (loadingMedicine || loadingStock) {
    return (
      <div className="flex justify-center py-10">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!medicine) return null;

  const batches = stock?.batches || [];
  const totalQuantity = batches.reduce((s, b) => s + b.quantityRemaining, 0);
  const totalValue = batches.reduce(
    (s, b) => s + b.quantityRemaining * b.purchasePrice,
    0,
  );
  const avgSellPrice =
    batches.length > 0
      ? batches.reduce((s, b) => s + b.sellPrice, 0) / batches.length
      : 0;
  const avgPurchasePrice =
    batches.length > 0
      ? batches.reduce((s, b) => s + b.purchasePrice, 0) / batches.length
      : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <StatCard
          icon={DollarSign}
          label="متوسط سعر الشراء"
          value={
            <span className="flex items-center gap-1">
              {formatCurrency(avgPurchasePrice)}
              <SaudiRiyal className="w-4 h-4" />
            </span>
          }
        />
        <StatCard
          icon={DollarSign}
          label="متوسط سعر البيع"
          value={
            <span className="flex items-center gap-1">
              {formatCurrency(avgSellPrice)}
              <SaudiRiyal className="w-4 h-4" />
            </span>
          }
        />
      </div>

      <div className="rounded-xl border border-border/50 bg-card/50 p-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">
          معلومات الصنف
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">الاسم</p>
            <p className="font-medium">{medicine.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">الاسم بالعربية</p>
            <p className="font-medium">{medicine.arabicName || "-"}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">الباركود</p>
            <p className="font-medium font-mono">{medicine.barcode || "-"}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">الوحدة</p>
            <MedicineUnitBadge unit={medicine.unit} />
          </div>
          <div>
            <p className="text-muted-foreground text-xs">الفئة</p>
            <p className="font-medium">{medicine.categoryName || "-"}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">تاريخ الإضافة</p>
            <p className="font-medium">
              {medicine.createdAt
                ? new Date(medicine.createdAt).toLocaleDateString("ar-SA")
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}