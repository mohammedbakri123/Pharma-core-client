import { CardHeader, CardTitle, CardDescription } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { ArrowRight, Package } from "lucide-react";

interface StockItemHeaderProps {
  medicineName: string;
  medicineId: number;
  totalQuantity: number;
  onBack: () => void;
}

export function StockItemHeader({ medicineName, medicineId, totalQuantity, onBack }: StockItemHeaderProps) {
  return (
    <CardHeader className="text-right border-b border-border/40 bg-card pb-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="mb-2 -mr-2 gap-1 text-muted-foreground hover:text-foreground"
      >
        <ArrowRight className="w-4 h-4" />
        العودة إلى المخزون
      </Button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="order-2 sm:order-1 flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">{medicineName}</CardTitle>
            <CardDescription className="text-sm mt-0.5">
              <Badge variant="secondary" className="font-normal text-xs">
                #{medicineId}
              </Badge>
            </CardDescription>
          </div>
        </div>

        <div className="order-1 sm:order-2 text-left sm:text-right w-full sm:w-auto">
          <p className="text-3xl font-bold text-primary">{totalQuantity}</p>
          <p className="text-xs text-muted-foreground">إجمالي المخزون</p>
        </div>
      </div>
    </CardHeader>
  );
}
