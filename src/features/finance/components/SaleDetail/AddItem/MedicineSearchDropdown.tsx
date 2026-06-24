import { type RefObject } from "react";
import { Badge } from "@/ui/badge";
import { stockStatusVariant } from "@features/inventory/components/Inventory/stockStatusConfig";
import type { StockAlertDto } from "@features/inventory/types/inventory";

interface MedicineSearchDropdownProps {
  loading: boolean;
  results: StockAlertDto[];
  onSelect: (medicine: StockAlertDto) => void;
  containerRef: RefObject<HTMLDivElement | null>;
}

export default function MedicineSearchDropdown({
  loading,
  results,
  onSelect,
  containerRef,
}: MedicineSearchDropdownProps) {
  return (
    <div
      ref={containerRef}
      className="absolute z-50 w-full rounded-md border bg-popover shadow-md"
    >
      {loading ? (
        <div className="p-2 text-sm text-muted-foreground">
          جاري البحث...
        </div>
      ) : results.length ? (
        <div className="max-h-48 overflow-y-auto">
          {results.map((medicine) => (
            <button
              key={medicine.medicineId}
              type="button"
              className="w-full flex items-center justify-between gap-2 px-3 py-2 text-right hover:bg-accent"
              onClick={() => onSelect(medicine)}
            >
              <div className="min-w-0">
                <div className="truncate font-medium">{medicine.name}</div>
                {medicine.arabicName && (
                  <div className="truncate text-xs text-muted-foreground">
                    {medicine.arabicName}
                  </div>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge variant={stockStatusVariant[medicine.status]}>
                  {medicine.totalQuantity}
                </Badge>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="p-2 text-sm text-muted-foreground">
          لا توجد نتائج
        </div>
      )}
    </div>
  );
}
