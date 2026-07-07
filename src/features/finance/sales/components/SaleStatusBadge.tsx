import { SaleStatus } from "@/types";
import { Badge } from "@/ui/badge";

const statusConfig: Record<
  SaleStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  [SaleStatus.Draft]: { label: "مسودة", variant: "secondary" },
  [SaleStatus.Completed]: { label: "مكتملة", variant: "default" },
  [SaleStatus.Cancelled]: { label: "ملغية", variant: "destructive" },
};

interface SaleStatusBadgeProps {
  status: SaleStatus;
}

export default function SaleStatusBadge({ status }: SaleStatusBadgeProps) {
  const config = statusConfig[status];
  if (!config) return <Badge variant="outline">غير معروف</Badge>;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
