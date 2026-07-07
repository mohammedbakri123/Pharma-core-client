import { Check } from "lucide-react";
import { cn } from "@/utils/utils";
import { formatCurrency } from "@/utils/formatters";
import type { PurchaseItemDetailsDto } from "@/types";

interface ReturnablePurchaseItemCardProps {
  item: PurchaseItemDetailsDto;
  isSelected: boolean;
  onSelect: (purchaseItemId: number) => void;
}

export default function ReturnablePurchaseItemCard({
  item,
  isSelected,
  onSelect,
}: ReturnablePurchaseItemCardProps) {
  return (
    <div
      onClick={() => onSelect(item.purchaseItemId)}
      className={cn(
        "p-3 rounded-lg border text-right cursor-pointer transition-all flex flex-row-reverse justify-between items-center select-none",
        isSelected
          ? "border-primary bg-primary/10 shadow-xs scale-[0.99]"
          : "border-border/50 bg-background hover:bg-muted/40 hover:border-border",
      )}
    >
      <div className="flex items-center gap-3 flex-row-reverse">
        <div
          className={cn(
            "h-5 w-5 rounded-full border flex items-center justify-center shrink-0",
            isSelected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-muted-foreground/30 bg-background",
          )}
        >
          {isSelected && <Check className="w-3.5 h-3.5 stroke-3" />}
        </div>
        <div>
          <p className="font-semibold text-sm text-foreground">
            {item.medicineName}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            رقم الباتش: {item.batchNumber || "غير محدد"}
          </p>
        </div>
      </div>
      <div className="text-left">
        <span className="text-[10px] text-muted-foreground block">
          الكمية المشتراة: {item.quantity} | السعر:
        </span>
        <span className="font-semibold font-mono text-xs text-foreground">
          {formatCurrency(item.purchasePrice)}
        </span>
      </div>
    </div>
  );
}
