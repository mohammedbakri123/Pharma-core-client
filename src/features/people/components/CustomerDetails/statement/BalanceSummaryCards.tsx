import { formatCurrency } from "@/utils/formatters";

interface BalanceSummaryCardsProps {
  openingBalance: number;
  closingBalance: number;
}

export default function BalanceSummaryCards({
  openingBalance,
  closingBalance,
}: BalanceSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-3 rounded-lg border bg-background/50 flex flex-col justify-center">
        <span className="text-[10px] text-muted-foreground font-semibold">الرصيد الافتتاحي</span>
        <span className={`text-sm font-bold ${openingBalance > 0 ? "text-destructive" : "text-emerald-600"}`}>
          {formatCurrency(openingBalance)} ر.س
        </span>
      </div>
      <div className="p-3 rounded-lg border bg-background/50 flex flex-col justify-center">
        <span className="text-[10px] text-muted-foreground font-semibold">الرصيد الختامي</span>
        <span className={`text-sm font-bold ${closingBalance > 0 ? "text-destructive" : "text-emerald-600"}`}>
          {formatCurrency(closingBalance)} ر.س
        </span>
      </div>
    </div>
  );
}
