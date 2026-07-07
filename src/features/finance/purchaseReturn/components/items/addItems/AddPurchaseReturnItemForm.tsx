import { Label } from "@/ui/label";
import { Button } from "@/ui/button";
import type { PurchaseItemDetailsDto } from "@/types";
import ReturnablePurchaseItemCard from "./ReturnablePurchaseItemCard";
import QuantityAdjuster from "./QuantityAdjuster";
import RefundSummaryCard from "./RefundSummaryCard";

interface AddPurchaseReturnItemFormProps {
  returnableItems: PurchaseItemDetailsDto[];
  selectedItemId: string;
  onSelectItem: (purchaseItemId: number) => void;
  selectedPurchaseItem: PurchaseItemDetailsDto | undefined;
  quantity: string;
  onQuantityChange: (value: string) => void;
  isPending: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onReturnAll: () => void;
}

export default function AddPurchaseReturnItemForm({
  returnableItems,
  selectedItemId,
  onSelectItem,
  selectedPurchaseItem,
  quantity,
  onQuantityChange,
  isPending,
  onSubmit,
  onReturnAll,
}: AddPurchaseReturnItemFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5 text-right mt-2">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          اختر صنفاً من قائمة المشتريات
        </Label>

        <div className="space-y-2 max-h-55 overflow-y-auto pr-1 border rounded-lg p-2 bg-muted/10 border-border/40">
          {returnableItems.map((item) => (
            <ReturnablePurchaseItemCard
              key={item.purchaseItemId}
              item={item}
              isSelected={selectedItemId === item.purchaseItemId.toString()}
              onSelect={onSelectItem}
            />
          ))}
        </div>
      </div>

      {selectedPurchaseItem && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <QuantityAdjuster
            value={quantity}
            onChange={onQuantityChange}
            max={selectedPurchaseItem.quantity}
          />

          <RefundSummaryCard
            unitPrice={selectedPurchaseItem.purchasePrice}
            quantity={Number(quantity || 0)}
            maxQuantity={selectedPurchaseItem.quantity}
            onReturnAll={onReturnAll}
          />
        </div>
      )}

      <div className="flex justify-end gap-2 sm:gap-0 mt-6 pt-2 border-t border-border/20">
        <Button
          type="submit"
          disabled={isPending || !selectedItemId}
          className="w-full sm:w-auto cursor-pointer"
        >
          {isPending ? "جاري الإضافة..." : "إضافة إلى المرتجع"}
        </Button>
      </div>
    </form>
  );
}
