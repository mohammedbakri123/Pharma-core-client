import { PurchaseReturnStatus } from "@/types";
import { Badge } from "@/ui/badge";

const statusConfig: Record<
  PurchaseReturnStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  [PurchaseReturnStatus.Draft]: { label: "مسودة", variant: "secondary" },
  [PurchaseReturnStatus.Completed]: { label: "مكتمل", variant: "default" },
  [PurchaseReturnStatus.Cancelled]: { label: "ملغي", variant: "destructive" },
};

interface PurchaseReturnStatusBadgeProps {
  status: PurchaseReturnStatus;
}

export default function PurchaseReturnStatusBadge({ status }: PurchaseReturnStatusBadgeProps) {
  const config = statusConfig[status];
  if (!config) return <Badge variant="outline">غير معروف</Badge>;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
