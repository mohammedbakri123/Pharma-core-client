import { User, Calendar, Package, Banknote, FileText } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { StatCard } from "@/ui/stat-card";
import type { SalesReturnDetailsDto } from "@/types";

interface SaleReturnInfoCardsProps {
  returnData: SalesReturnDetailsDto;
}

export default function SaleReturnInfoCards({ returnData }: SaleReturnInfoCardsProps) {
  const items = returnData.items || [];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={User}
          label="العميل"
          value={returnData.customerName || <span className="text-muted-foreground/60">-</span>}
        />
        <StatCard
          icon={Calendar}
          label="تاريخ الإنشاء"
          value={formatDate(returnData.createdAt)}
        />
        <StatCard
          icon={Package}
          label="عدد الأصناف"
          value={items.length}
        />
        <StatCard
          icon={Banknote}
          label="الإجمالي"
          value={
            <span className="flex items-center gap-1">
              {formatCurrency(returnData.totalAmount)}
              <Banknote className="w-4 h-4 text-muted-foreground" />
            </span>
          }
        />
      </div>

      {returnData.note && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/40 text-sm">
          <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground">ملاحظات:</span>
          <span>{returnData.note}</span>
        </div>
      )}
    </>
  );
}
