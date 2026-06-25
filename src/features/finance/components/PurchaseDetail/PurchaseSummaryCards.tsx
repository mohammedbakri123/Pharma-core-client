import { Banknote, FileText, ShoppingCart, Wallet } from "lucide-react";
import { StatCard } from "@/ui/stat-card";
import { formatCurrency } from "@/utils/formatters";
import type { PurchaseBalanceDto, PurchaseDetailsDto } from "@/types";

interface PurchaseSummaryCardsProps {
  purchase: PurchaseDetailsDto;
  balance?: PurchaseBalanceDto;
}

export default function PurchaseSummaryCards({
  purchase,
  balance,
}: PurchaseSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        icon={Wallet}
        label="الإجمالي"
        value={
          <span className="flex items-center gap-1">
            {formatCurrency(purchase.totalAmount)}
            <Banknote className="w-4 h-4 text-muted-foreground" />
          </span>
        }
      />
      <StatCard
        icon={ShoppingCart}
        label="عدد الأصناف"
        value={purchase.items.length}
      />
      <StatCard
        icon={Banknote}
        label="المدفوع"
        value={balance ? formatCurrency(balance.paidAmount) : formatCurrency(0)}
      />
      <StatCard
        icon={FileText}
        label="المتبقي"
        value={
          balance
            ? formatCurrency(balance.remainingAmount)
            : formatCurrency(purchase.totalAmount)
        }
      />
    </div>
  );
}
