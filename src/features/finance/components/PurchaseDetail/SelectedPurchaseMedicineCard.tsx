import { Badge } from "@/ui/badge";
import type { MedicineDto } from "@/types";

interface SelectedPurchaseMedicineCardProps {
  medicine: MedicineDto;
}

export default function SelectedPurchaseMedicineCard({
  medicine,
}: SelectedPurchaseMedicineCardProps) {
  return (
    <div className="rounded-md border p-3 sm:col-span-2">
      <div className="mb-1 flex items-center justify-between gap-3">
        <span className="font-medium truncate">{medicine.name}</span>
        <Badge variant="secondary">#{medicine.medicineId}</Badge>
      </div>

      {medicine.arabicName && (
        <div className="mb-1 text-sm text-muted-foreground">
          {medicine.arabicName}
        </div>
      )}

      <div className="text-sm text-muted-foreground">
        الفئة: {medicine.categoryName ?? "---"} | الوحدة:{" "}
        {medicine.unit ?? "---"}
      </div>

      {medicine.barcode && (
        <div className="mt-1 text-xs text-muted-foreground" dir="ltr">
          {medicine.barcode}
        </div>
      )}
    </div>
  );
}
