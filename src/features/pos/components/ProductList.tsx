import { useRef, useEffect, useState, useCallback } from "react";
import ProductListItem from "./ProductListItem";
import type { StockAlertDto } from "@features/inventory/types/inventory";
import { useCartContext } from "../context/pos-cart-context";
import { useAddToCart } from "../hooks/use-add-to-cart";

interface ProductListProps {
  products: StockAlertDto[];
  getProductName: (medicineId: number) => string | undefined;
  loading: boolean;
  initialLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border/20 px-5 py-3.5 animate-pulse">
      <div className="h-11 w-11 rounded-lg bg-muted/50" />
      <div className="flex-1 space-y-2.5">
        <div className="h-3.5 w-2/3 rounded bg-muted/50" />
        <div className="h-2.5 w-1/3 rounded bg-muted/30" />
      </div>
      <div className="h-8 w-12 rounded bg-muted/30" />
    </div>
  );
}

export default function ProductList({
  products,
  getProductName,
  loading,
  initialLoading,
  hasMore,
  loadMore,
}: ProductListProps) {
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

  return (
    <div className="flex h-full flex-col">
      {initialLoading ? (
        <div className="flex flex-col gap-1.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center py-12">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border/30 bg-muted/20">
              <svg
                className="h-8 w-8 text-muted-foreground/30"
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
            {/* Decorative rings */}
            <div className="absolute inset-0 rounded-2xl border border-border/10 scale-110 animate-pulse" />
            <div className="absolute inset-0 rounded-2xl border border-border/5 scale-125" />
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground/70">
              ابدأ بالبحث عن المنتجات
            </p>
            <p className="text-xs text-muted-foreground/40">
              ابحث بالاسم أو الباركود لإضافة منتجات
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {/* Header row */}
          <div className="flex items-center gap-4 px-5 py-2 text-[10px] font-medium text-muted-foreground/30 uppercase tracking-widest">
            <div className="w-11" />
            <div className="flex-1">المنتج</div>
            <div className="w-12 text-center">المخزون</div>
          </div>

          {/* Product list */}
          <div className="flex flex-col gap-1.5 px-5 pb-2">
            {products.map((product, index) => (
              <div
                key={product.medicineId}
                className="animate-in fade-in slide-in-from-left-1 duration-300 fill-mode-both"
                style={{ animationDelay: `${Math.min(index * 25, 500)}ms` }}
              >
                <ProductListItem
                  product={product}
                  onClick={addToCart}
                  isAdding={addingIds.has(product.medicineId)}
                  cartQuantity={cartQuantities(product.medicineId)}
                />
              </div>
            ))}
          </div>

          {/* Loading more */}
          {loading && (
            <div className="flex flex-col gap-1.5 mt-1.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonRow key={`skeleton-${i}`} />
              ))}
            </div>
          )}

          <div ref={sentinelRef} className="h-4" />
        </div>
      )}
    </div>
  );
}
