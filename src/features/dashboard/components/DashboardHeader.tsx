import { Link } from "react-router-dom";
import { CalendarDays, Plus, RefreshCw } from "lucide-react";

import { Button } from "@/ui/button";
import { formatDate } from "@/utils/formatters";
import { cn } from "@/utils/utils";
import { dashboardRanges, type DashboardRangeKey } from "../constants";

interface DashboardHeaderProps {
  from: string;
  to: string;
  range: DashboardRangeKey;
  isFetching: boolean;
  onRangeChange: (range: DashboardRangeKey) => void;
  onRefresh: () => void;
}

export function DashboardHeader({
  from,
  to,
  range,
  isFetching,
  onRangeChange,
  onRefresh,
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          <span>
            {formatDate(from)} - {formatDate(to)}
          </span>
        </div>
        <div>
          <h2 className="text-3xl font-heading font-bold text-foreground">
            لوحة التحكم
          </h2>
          <p className="text-muted-foreground">
            متابعة فورية للمبيعات، النقدية، وتنبيهات المخزون.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="grid grid-cols-3 rounded-lg border bg-card p-1">
          {dashboardRanges.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => onRangeChange(item.key)}
              className={cn(
                "h-9 rounded-md px-3 text-sm font-medium transition-colors",
                range === item.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
          تحديث
        </Button>
        <Button asChild>
          <Link to="/pos">
            <Plus className="h-4 w-4" />
            بيع جديد
          </Link>
        </Button>
      </div>
    </header>
  );
}
