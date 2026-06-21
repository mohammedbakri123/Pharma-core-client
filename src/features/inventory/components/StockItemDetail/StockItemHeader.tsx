import { Button } from "@/ui/button";
import { ArrowRight, Package } from "lucide-react";

interface StockItemHeaderProps {
  medicineName: string;
  medicineId: number;
  totalQuantity: number;
  onBack: () => void;
}

export function StockItemHeader({
  medicineName,
  medicineId,
  totalQuantity,
  onBack,
}: StockItemHeaderProps) {
  return (
    <>
      <div className="h-1.5 bg-linear-to-l from-primary via-primary/60 to-primary/20" />

      <div className="p-6 bg-linear-to-br from-primary/10 via-primary/5 to-background border-b border-border/40">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-4 -mr-2 gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          العودة إلى المخزون
        </Button>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-linear-to-tr from-primary to-primary/70 text-primary-foreground flex items-center justify-center shrink-0 shadow-md border border-primary/20">
              <Package className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-foreground">
                {medicineName}
              </h1>
              <p className="text-xs text-muted-foreground">
                رقم الصنف: #{medicineId}
              </p>
            </div>
          </div>

          <div className="w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-border/40">
            <p className="text-3xl font-bold text-primary text-right">
              {totalQuantity}
            </p>
            <p className="text-xs text-muted-foreground text-right">
              إجمالي المخزون
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
