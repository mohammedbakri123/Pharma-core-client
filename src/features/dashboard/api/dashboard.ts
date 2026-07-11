import api from "@/api/client";
import type { DashboardReport, DashboardReportParams } from "../types/dashboard";

export const getDashboardReport = (params?: DashboardReportParams) =>
  api.get<DashboardReport>("/reports/dashboard", { params });
