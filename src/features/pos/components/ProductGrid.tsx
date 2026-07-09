import { useRef, useEffect } from "react";
import { ScrollArea } from "@/ui/scroll-area";
import { Spinner } from "@/ui/spinner";
import ProductCard from "./ProductCard";
import type { StockAlertDto } from "@features/inventory/types/inventory";

export default function ProductGrid({
  products,
  addToCart,
  addingIds,
  loading,
  initialLoading,
  hasMore,
  loadMore,
}: {
  products: StockAlertDto[];
  addToCart: (id: number) => void;
  addingIds: Set<number>;
  loading: boolean;
  initialLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
}) {
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
      <div className="flex-1 flex items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        ابدأ بالبحث عن المنتجات
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 pl-4">
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
