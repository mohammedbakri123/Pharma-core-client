import type { SaleDetailsDto } from "@/types";
import { ArrowRight, Coins } from "lucide-react";
import { Button } from "@/ui/button";
import SaleStatusBadge from "../Sales/SaleStatusBadge";

interface SaleDetailHeaderProps {
  sale: SaleDetailsDto;
  onBack: () => void;
}

export default function SaleDetailHeader({
  sale,
  onBack,
}: SaleDetailHeaderProps) {
  return (
    <>
      {/* <div className="h-1.5 bg-linear-to-l from-primary via-primary/60 to-primary/20" /> */}

      <div className="p-6 bg-linear-to-br from-primary/10 via-primary/5 to-background border-b border-border/40">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-4 -mr-2 gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          العودة إلى المبيعات
        </Button>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-linear-to-tr from-primary to-primary/70 text-primary-foreground flex items-center justify-center shrink-0 shadow-md border border-primary/20">
              <Coins className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">
                  فاتورة مبيعات #{sale.saleId}
                </h1>
                <SaleStatusBadge status={sale.status} />
              </div>
              <p className="text-xs text-muted-foreground">
                {sale.customerName && `العميل: ${sale.customerName}`}
                {sale.customerName && sale.userName && " | "}
                {sale.userName && `بواسطة: ${sale.userName}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
