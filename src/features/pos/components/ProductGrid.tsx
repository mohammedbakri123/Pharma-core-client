import { useRef, useEffect, useState, useCallback } from "react";
import { ScrollArea } from "@/ui/scroll-area";
import { Spinner } from "@/ui/spinner";
import ProductCard from "./ProductCard";
import type { StockAlertDto } from "@features/inventory/types/inventory";
import { useCartContext } from "../context/pos-cart-context";
import { useAddToCart } from "../hooks/use-add-to-cart";

interface ProductGridProps {
  products: StockAlertDto[];
  getProductName: (medicineId: number) => string | undefined;
  loading: boolean;
  initialLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
}

export default function ProductGrid({
  products,
  getProductName,
  loading,
  initialLoading,
  hasMore,
  loadMore,
}: ProductGridProps) {
  const { addItem } = useCartContext();
  const [addingIds, setAddingIds] = useState<Set<number>>(new Set());
  const addToCartBase = useAddToCart(addItem, getProductName);
  const addToCart = useCallback(
    async (medicineId: number) => {
      setAddingIds((prev) => new Set(prev).add(medicineId));
      try {
        await addToCartBase(medicineId);
      } finally {
        setAddingIds((prev) => {
          const next = new Set(prev);
          next.delete(medicineId);
          return next;
        });
      }
    },
    [addToCartBase],
  );
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) loadMore();
      },
      { rootMargin: "100px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMore, products.length]);

  if (initialLoading) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center text-muted-foreground">
        ابدأ بالبحث عن المنتجات
      </div>
    );
  }

  return (
    <ScrollArea className="min-h-0 pl-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
        {products.map((product) => (
          <ProductCard
            key={product.medicineId}
            product={product}
            onClick={addToCart}
            isAdding={addingIds.has(product.medicineId)}
            viewMode="grid"
          />
        ))}
      </div>
      {loading && (
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      )}
      <div ref={sentinelRef} className="h-4" />
    </ScrollArea>
  );
}
