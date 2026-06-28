import { SalesReturnStatus } from "@/types";
import { Badge } from "@/ui/badge";

const statusConfig: Record<
  SalesReturnStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  [SalesReturnStatus.Draft]: { label: "مسودة", variant: "secondary" },
  [SalesReturnStatus.Completed]: { label: "مكتمل", variant: "default" },
  [SalesReturnStatus.Cancelled]: { label: "ملغي", variant: "destructive" },
};

interface SalesReturnStatusBadgeProps {
  status: SalesReturnStatus;
}

export default function SalesReturnStatusBadge({ status }: SalesReturnStatusBadgeProps) {
  const config = statusConfig[status];
  if (!config) return <Badge variant="outline">غير معروف</Badge>;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
