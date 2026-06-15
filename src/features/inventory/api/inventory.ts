import api from "../../../core/api/client";
import type {
  StockAlertResponse,
  GetStockAlertQuery,
} from "../types/inventory";

// Inventory stock
const GetAlerts = (params?: GetStockAlertQuery) =>
  api.get<StockAlertResponse>("/inventory/alerts", { params });

const inventoryApi = {
  GetAlerts,
};

export default inventoryApi;
