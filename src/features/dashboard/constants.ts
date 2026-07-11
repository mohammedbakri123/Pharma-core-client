export type DashboardRangeKey = "today" | "week" | "month";

export const dashboardRanges: Array<{
  key: DashboardRangeKey;
  label: string;
  days: number;
}> = [
  { key: "today", label: "اليوم", days: 1 },
  { key: "week", label: "7 أيام", days: 7 },
  { key: "month", label: "30 يوم", days: 30 },
];
