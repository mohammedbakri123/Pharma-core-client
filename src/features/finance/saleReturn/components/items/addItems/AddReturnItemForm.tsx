import { Label } from "@/ui/label";
import { Button } from "@/ui/button";
import type { SaleItemDto } from "@/types";
import ReturnableItemCard from "./ReturnableItemCard";
import QuantityAdjuster from "./QuantityAdjuster";
import RefundSummaryCard from "./RefundSummaryCard";

interface AddReturnItemFormProps {
  returnableItems: SaleItemDto[];
  selectedItemId: string;
  onSelectItem: (saleItemId: number) => void;
  selectedSaleItem: SaleItemDto | undefined;
  quantity: string;
  onQuantityChange: (value: string) => void;
  isPending: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onReturnAll: () => void;
}

export default function AddReturnItemForm({
  returnableItems,
  selectedItemId,
  onSelectItem,
  selectedSaleItem,
  quantity,
  onQuantityChange,
  isPending,
  onSubmit,
  onReturnAll,
}: AddReturnItemFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5 text-right mt-2">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          اختر صنفاً من قائمة المبيعات
        </Label>

        <div className="space-y-2 max-h-55 overflow-y-auto pr-1 border rounded-lg p-2 bg-muted/10 border-border/40">
          {returnableItems.map((item) => (
            <ReturnableItemCard
              key={item.saleItemId}
              item={item}
              isSelected={selectedItemId === item.saleItemId.toString()}
              onSelect={onSelectItem}
            />
          ))}
        </div>
      </div>

      {selectedSaleItem && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <QuantityAdjuster
            value={quantity}
            onChange={onQuantityChange}
            max={selectedSaleItem.quantity}
          />

          <RefundSummaryCard
            unitPrice={selectedSaleItem.unitPrice}
            quantity={Number(quantity || 0)}
            maxQuantity={selectedSaleItem.quantity}
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
