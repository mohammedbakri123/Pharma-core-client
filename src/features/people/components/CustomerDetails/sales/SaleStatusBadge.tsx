import { Badge } from "@/ui/badge";

interface SaleStatusBadgeProps {
  status: string;
}

export default function SaleStatusBadge({ status }: SaleStatusBadgeProps) {
  switch (status.toLowerCase()) {
    case "paid":
    case "completed":
      return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-transparent">مدفوعة</Badge>;
    case "partiallypaid":
      return <Badge variant="secondary" className="bg-amber-100 hover:bg-amber-200 text-amber-800 border-transparent">مدفوعة جزئياً</Badge>;
    case "unpaid":
      return <Badge variant="destructive">غير مدفوعة</Badge>;
    case "returned":
      return <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50">مرتجعة</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
