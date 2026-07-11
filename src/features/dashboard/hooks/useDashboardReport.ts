import { useQuery } from "@tanstack/react-query";
import { getDashboardReport } from "../api/dashboard";
import type { DashboardReportParams } from "../types/dashboard";

export function useDashboardReport(params: DashboardReportParams) {
  return useQuery({
    queryKey: ["reports", "dashboard", params],
    queryFn: async () => {
      const response = await getDashboardReport(params);
      return response.data;
    },
  });
}
