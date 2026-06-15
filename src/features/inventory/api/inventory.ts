import api from "../../../core/api/client";
import type {
  StockAlertResponse,
  GetStockAlertQuery,
  StockWithBatchesDto,
} from "../types/inventory";

// Inventory stock
const GetAlerts = (params?: GetStockAlertQuery) =>
  api.get<StockAlertResponse>("/inventory/alerts", { params });

const GetStockByMedicine = (id: number) =>
  api.get<StockWithBatchesDto>(`/inventory/stock/${id}`);

const inventoryApi = {
  GetAlerts,
  GetStockByMedicine,
};

export default inventoryApi;
