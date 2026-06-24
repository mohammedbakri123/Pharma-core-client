import { StockStatus } from "@/types";
import { Badge } from "@/ui/badge";
import { stockStatusLabel, stockStatusVariant } from "./stockStatusConfig";

interface StockStatusBadgeProps {
  status: StockStatus;
}

export default function StockStatusBadge({ status }: StockStatusBadgeProps) {
  return (
    <Badge variant={stockStatusVariant[status]}>
      {stockStatusLabel[status]}
    </Badge>
  );
}
