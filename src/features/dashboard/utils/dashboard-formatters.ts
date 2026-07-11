import { formatCurrency } from "@/utils/formatters";
import { dashboardRanges, type DashboardRangeKey } from "../constants";
import type { DashboardReportParams } from "../types/dashboard";

export function formatAmount(value: number) {
  return `${formatCurrency(value)} ريال`;
}

export function formatTime(value: string | null | undefined) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("ar-SA", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function getRangeParams(range: DashboardRangeKey): DashboardReportParams {
  const days = dashboardRanges.find((item) => item.key === range)?.days ?? 7;
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - days + 1);

  return {
    from: toDateParam(from),
    to: toDateParam(to),
  };
}

export function formatChartLabel(date: string, range: DashboardRangeKey) {
  return new Intl.DateTimeFormat("ar-SA", {
    weekday: range === "month" ? undefined : "short",
    day: "numeric",
    month: "short",
  }).format(new Date(date));
}

function toDateParam(date: Date) {
  return date.toISOString().slice(0, 10);
}
