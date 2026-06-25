import { Badge } from "@/ui/badge";
import type {
  StockAlertDto,
  StockWithBatchesDto,
} from "@features/inventory/types/inventory";
import { SaudiRiyal } from "lucide-react";

interface SelectedMedicineCardProps {
  medicine: StockAlertDto;
  stockDetail: StockWithBatchesDto;
}

export default function SelectedMedicineCard({
  medicine,
  stockDetail,
}: SelectedMedicineCardProps) {
  return (
    <div className="rounded-md border p-3">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-medium">{stockDetail.medicineName}</span>
        <Badge>{stockDetail.batches[0]?.sellPrice ?? "---"} ر.س</Badge>
      </div>
      {medicine.arabicName && (
        <div className="mb-1 text-sm text-muted-foreground">
          {medicine.arabicName}
        </div>
      )}
      <div className="text-sm text-muted-foreground">
        المخزون: {stockDetail.totalStock} | الوحدة: {medicine.unit ?? "---"}
        {stockDetail.totalStock === 0 && (
          <Badge variant="destructive" className="mr-2">
            نفذ
          </Badge>
        )}
      </div>
      {stockDetail.batches.length > 1 && (
        <div className="mt-2 text-xs text-muted-foreground">
          {stockDetail.batches.length} batches available
        </div>
      )}
    </div>
  );
}
