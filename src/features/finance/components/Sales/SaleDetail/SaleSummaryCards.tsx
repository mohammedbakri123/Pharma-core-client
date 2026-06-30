import { Coins, BadgePercent, Wallet, Banknote } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { StatCard } from "@/ui/stat-card";
import type { SaleDetailsDto, SaleBalanceDto } from "@/types";

interface SaleSummaryCardsProps {
  sale: SaleDetailsDto;
  balance?: SaleBalanceDto;
}

export default function SaleSummaryCards({
  sale,
  balance,
}: SaleSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        icon={Coins}
        label="الإجمالي"
        value={
          <span className="flex items-center gap-1">
            {formatCurrency(sale.totalAmount)}
            <Banknote className="w-4 h-4 text-muted-foreground" />
          </span>
        }
      />
      <StatCard
        icon={BadgePercent}
        label="الخصم"
        value={
          sale.discount > 0 ? (
            formatCurrency(sale.discount)
          ) : (
            <span className="text-muted-foreground/60">-</span>
          )
        }
      />
      <StatCard
        icon={Wallet}
        label="المدفوع"
        value={
          <span className="flex items-center gap-1">
            {balance ? formatCurrency(balance.paidAmount) : formatCurrency(0)}
            <Banknote className="w-4 h-4 text-muted-foreground" />
          </span>
        }
      />
      <StatCard
        icon={Banknote}
        label="المتبقي"
        value={
          <span className="flex items-center gap-1">
            {balance
              ? formatCurrency(balance.remainingAmount)
              : formatCurrency(sale.totalAmount)}
            <Banknote className="w-4 h-4 text-muted-foreground" />
          </span>
        }
      />
    </div>
  );
}
