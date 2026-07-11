import { useState, useEffect, useCallback, useRef } from "react";
import inventoryApi from "@features/inventory/api/inventory";
import type { StockAlertDto } from "@features/inventory/types/inventory";

export function usePosProducts(search: string) {
  const [products, setProducts] = useState<StockAlertDto[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const limit = 30;
  const searchRef = useRef(search);

  const loadPage = useCallback(
    async (pageNum: number, append: boolean) => {
      setLoading(true);
      try {
        const res = await inventoryApi.GetAlerts({
          search: search || undefined,
          page: pageNum,
          limit,
          LowStockThreshold: null,
          ExpiringDays: null,
          ExcludeZeroStock: true,
        });
        setTotal(res.data.pagination.total);
        if (append) {
          setProducts((prev) => [...prev, ...res.data.items]);
        } else {
          setProducts(res.data.items);
        }
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [search],
  );

  // Reset when search changes
  useEffect(() => {
    searchRef.current = search;
    setPage(1);
    setProducts([]);
    setInitialLoading(true);
    loadPage(1, false);
  }, [search, loadPage]);

  const loadMore = useCallback(() => {
    if (loading || products.length >= total) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadPage(nextPage, true);
  }, [loading, products.length, total, page, loadPage]);

  const hasMore = products.length < total;

  return { products, loading, initialLoading, hasMore, loadMore };
}
