import type { StockAlertDto } from "@features/inventory/types/inventory";
import type { PaymentOverviewItem } from "@features/finance/common/types/payment";
import type { SaleDto } from "@features/finance/common/types/sale";

export interface DashboardReport {
  from: string;
  to: string;
  sales: DashboardSalesSummary;
  cashflow: DashboardCashflowSummary;
  inventory: DashboardInventorySummary;
  dailySales: DashboardDailySales[];
  recentSales: SaleDto[];
  recentPayments: PaymentOverviewItem[];
}

export interface DashboardSalesSummary {
  totalSales: number;
  grossRevenue: number;
  totalDiscount: number;
  netRevenue: number;
  averageSale: number;
  cashSales: number;
  cardSales: number;
  creditSales: number;
}

export interface DashboardCashflowSummary {
  totalIn: number;
  totalOut: number;
  net: number;
  cashIn: number;
  cashOut: number;
  cashNet: number;
  cardIn: number;
  cardOut: number;
  cardNet: number;
}

export interface DashboardInventorySummary {
  lowStockCount: number;
  expiringCount: number;
  lowStockItems: StockAlertDto[];
  expiringItems: StockAlertDto[];
}

export interface DashboardDailySales {
  date: string;
  totalSales: number;
  grossRevenue: number;
  netRevenue: number;
}

export interface DashboardReportParams {
  from?: string;
  to?: string;
}
