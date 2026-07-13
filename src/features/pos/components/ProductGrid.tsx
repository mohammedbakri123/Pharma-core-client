import { useRef, useEffect, useState, useCallback } from "react";
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

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-border/50 bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="h-2 w-12 rounded-full bg-muted" />
        <div className="h-6 w-6 rounded-full bg-muted" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-3 w-1/2 rounded bg-muted" />
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex animate-pulse items-center gap-3 rounded-xl border border-border/40 bg-card px-3 py-2.5">
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="h-4 w-2/3 rounded bg-muted" />
        <div className="h-3 w-1/3 rounded bg-muted" />
      </div>
      <div className="h-8 w-8 shrink-0 rounded-full bg-muted" />
    </div>
  );
}

export default function ProductGrid({
  products,
  getProductName,
  loading,
  initialLoading,
  hasMore,
  loadMore,
}: ProductGridProps) {
  const { addItem, cart } = useCartContext();
  const [addingIds, setAddingIds] = useState<Set<number>>(new Set());
  const addToCartBase = useAddToCart(addItem, getProductName);

  const addToCart = useCallback(
    async (medicineId: number) => {
      if (addingIds.has(medicineId)) return;
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
    [addToCartBase, addingIds],
  );

  const cartQuantities = useCallback(
    (medicineId: number) => {
      const item = cart.find((i) => i.medicineId === medicineId);
      return item ? item.quantity : 0;
    },
    [cart],
  );

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) loadMore();
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  if (initialLoading) {
    return (
      <div className="h-full space-y-2 sm:grid sm:grid-cols-2 sm:gap-2 sm:space-y-0 md:grid-cols-3 md:gap-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="sm:hidden">
            <SkeletonRow />
          </div>
        ))}
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={`card-${i}`} className="hidden sm:block">
            <SkeletonCard />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border/50 bg-card">
          <svg
            className="h-7 w-7 text-muted-foreground/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">ابدأ بالبحث عن المنتجات</p>
          <p className="text-xs text-muted-foreground/60">ابحث بالاسم أو الباركود لإضافة منتجات</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pl-1 sm:pl-2">
      {/* Mobile: single-column list with dividers */}
      <div className="divide-y divide-border/30 sm:hidden">
        {products.map((product, index) => (
          <div
            key={product.medicineId}
            className="animate-in fade-in slide-in-from-bottom-1 duration-200"
            style={{ animationDelay: `${(index % 15) * 20}ms`, animationFillMode: "both" }}
          >
            <ProductCard
              product={product}
              onClick={addToCart}
              isAdding={addingIds.has(product.medicineId)}
              cartQuantity={cartQuantities(product.medicineId)}
            />
          </div>
        ))}
      </div>

      {/* Desktop: grid */}
      <div className="hidden grid-cols-2 gap-2 pb-3 sm:grid sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product, index) => (
          <div
            key={product.medicineId}
            className="animate-in fade-in slide-in-from-bottom-2 duration-300"
            style={{ animationDelay: `${(index % 20) * 30}ms`, animationFillMode: "both" }}
          >
            <ProductCard
              product={product}
              onClick={addToCart}
              isAdding={addingIds.has(product.medicineId)}
              cartQuantity={cartQuantities(product.medicineId)}
            />
          </div>
        ))}
      </div>

      {loading && (
        <>
          <div className="space-y-2 sm:hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonRow key={`skel-row-${i}`} />
            ))}
          </div>
          <div className="hidden grid-cols-2 gap-2 pb-3 sm:grid sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={`skeleton-${i}`} />
            ))}
          </div>
        </>
      )}

      <div ref={sentinelRef} className="h-2" />
    </div>
  );
}
