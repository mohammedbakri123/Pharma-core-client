import { SalesReturnBalanceDto, SalesReturnDetailsDto } from "@/types";
import { StatCard } from "@/ui/stat-card";
import { formatCurrency } from "@/utils/formatters";
import { Banknote, Coins, Wallet } from "lucide-react";
import React from "react";

interface SummaryCardsProps {
  balance: SalesReturnBalanceDto | undefined;
  salesReturn: SalesReturnDetailsDto;
}

export default function SalesReturnSummaryCards({
  balance,
  salesReturn,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <StatCard
        icon={Coins}
        label="إجمالي المرتجع"
        value={
          <span className="flex items-center gap-1">
            {formatCurrency(balance?.totalAmount ?? salesReturn.totalAmount)}
            <Banknote className="w-4 h-4 text-muted-foreground" />
          </span>
        }
      />
      <StatCard
        icon={Wallet}
        label="المبلغ المردود للعميل"
        value={
          <span className="flex items-center gap-1">
            {formatCurrency(balance?.paidAmount ?? 0)}
            <Banknote className="w-4 h-4 text-muted-foreground" />
          </span>
        }
      />
      <StatCard
        icon={Banknote}
        label="المتبقي المردود"
        value={
          <span className="flex items-center gap-1">
            {formatCurrency(
              balance?.remainingAmount ??
                balance?.totalAmount ??
                salesReturn.totalAmount,
            )}
            <Banknote className="w-4 h-4 text-muted-foreground" />
          </span>
        }
      />
    </div>
  );
}
