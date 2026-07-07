import { PurchaseStatus } from "@/types";
import { Badge } from "@/ui/badge";

const statusConfig: Record<
  PurchaseStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  [PurchaseStatus.Draft]: { label: "مسودة", variant: "secondary" },
  [PurchaseStatus.Completed]: { label: "مكتملة", variant: "default" },
  [PurchaseStatus.Cancelled]: { label: "ملغية", variant: "destructive" },
};

interface PurchaseStatusBadgeProps {
  status: PurchaseStatus;
}

export default function PurchaseStatusBadge({
  status,
}: PurchaseStatusBadgeProps) {
  const config = statusConfig[status];
  if (!config) return <Badge variant="outline">غير معروف</Badge>;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
