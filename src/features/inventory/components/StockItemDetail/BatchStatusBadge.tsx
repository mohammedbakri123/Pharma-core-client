import { Badge } from "@/ui/badge";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

function isExpired(dateStr: string | null) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

function isExpiringSoon(dateStr: string | null, days = 30) {
  if (!dateStr) return false;
  const diff = new Date(dateStr).getTime() - Date.now();
  return diff > 0 && diff <= days * 24 * 60 * 60 * 1000;
}

export function BatchStatusBadge({ expireDate }: { expireDate: string | null }) {
  if (isExpired(expireDate))
    return (
      <Badge
        variant="outline"
        className="border-red-300 text-red-600 bg-red-50 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400 gap-1"
      >
        <XCircle className="w-3 h-3" />
        منتهي
      </Badge>
    );
  if (isExpiringSoon(expireDate))
    return (
      <Badge
        variant="outline"
        className="border-amber-300 text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-400 gap-1"
      >
        <AlertTriangle className="w-3 h-3" />
        وشك الانتهاء
      </Badge>
    );
  return (
    <Badge
      variant="outline"
      className="border-emerald-300 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400 gap-1"
    >
      <CheckCircle2 className="w-3 h-3" />
      ساري
    </Badge>
  );
}
