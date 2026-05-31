import api from "./client";

export interface SalesReportData {
  period: string;
  totalSales: number;
  totalTransactions: number;
}

export interface CategoryReportData {
  category: string;
  totalSales: number;
  percentage: number;
}

export const getSalesReport = (from?: string, to?: string) =>
  api.get<SalesReportData[]>("/reports/sales", {
    params: { from, to },
  });

export const getCategoryReport = () =>
  api.get<CategoryReportData[]>("/reports/categories");
