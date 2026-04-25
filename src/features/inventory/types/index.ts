// Inventory feature types
export interface InventoryFilters {
  search?: string;
  categoryId?: number;
  status?: string;
}

export interface InventoryState {
  isLoading: boolean;
  error: string | null;
}
