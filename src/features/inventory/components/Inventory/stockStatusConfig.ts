import { StockStatus } from "@/types";

export const stockStatusLabel: Record<StockStatus, string> = {
  [StockStatus.Available]: "متوفر",
  [StockStatus.LowStock]: "مخزون منخفض",
  [StockStatus.Critical]: "حرج",
};

export const stockStatusVariant: Record<
  StockStatus,
  "default" | "secondary" | "destructive"
> = {
  [StockStatus.Available]: "default",
  [StockStatus.LowStock]: "secondary",
  [StockStatus.Critical]: "destructive",
};

export const stockStatusBadgeClass: Record<StockStatus, string> = {
  [StockStatus.Available]: "bg-green-600 hover:bg-green-600/95 text-white",
  [StockStatus.LowStock]: "bg-amber-600 hover:bg-amber-600/95 text-white",
  [StockStatus.Critical]: "bg-red-600 hover:bg-red-600/95 text-white",
};
