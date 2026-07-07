import { Button } from "@/ui/button";
import { formatCurrency } from "@/utils/formatters";

interface RefundSummaryCardProps {
  unitPrice: number;
  quantity: number;
  maxQuantity: number;
  onReturnAll: () => void;
}

export default function RefundSummaryCard({
  unitPrice,
  quantity,
  maxQuantity,
  onReturnAll,
}: RefundSummaryCardProps) {
  return (
    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex justify-between items-center flex-row-reverse text-right">
      <div>
        <span className="text-[11px] text-emerald-700/80 block font-medium">
          إجمالي القيمة المستردة
        </span>
        <span className="text-lg font-mono font-extrabold text-emerald-600">
          {formatCurrency(unitPrice * quantity)}
        </span>
      </div>
      <div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onReturnAll}
          className="text-xs h-8 border-emerald-500/20 text-emerald-700 hover:bg-emerald-500/10 cursor-pointer"
        >
          إرجاع الكل ({maxQuantity})
        </Button>
      </div>
    </div>
  );
}
